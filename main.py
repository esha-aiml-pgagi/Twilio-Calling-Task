# main.py
from fastapi import FastAPI, Request, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId
from pymongo import MongoClient, errors
import os
from dotenv import load_dotenv
import certifi
import io
import pandas as pd
from fastapi import UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# --- Config / Env ---
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "call_center_db")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI environment variable is not set. Add it to your .env or environment.")

# Create client but avoid network calls at import time; pass certifi CA bundle to avoid macOS TLS issues
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000)
db = client[DB_NAME]
calls_collection = db["call_recordings"]

# --- FastAPI App ---
app = FastAPI(title="Call Center Backend (MongoDB)", version="3.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specific domain list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class CallCreate(BaseModel):
    receiver_first_name: str
    receiver_last_name: str
    number: str
    company: str
    description: str
    personal_notes: Optional[str] = None

class RecordingData(BaseModel):
    number: str
    call_sid: str
    recording_sid: str
    recording_url: str
    recording_duration: str
    status: str

class CallUpdate(BaseModel):
    receiver_first_name: Optional[str] = None
    receiver_last_name: Optional[str] = None
    number: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    personal_notes: Optional[str] = None
    status: Optional[str] = None


# --- Startup / Shutdown handlers ---
@app.on_event("startup")
def startup_db():
    """
    Run once at app startup: check DB connectivity and create index if needed.
    Doing it here prevents import-time network failures that crash the process.
    """
    try:
        # ping to ensure connectivity and raise early if there's a TLS/whitelist issue
        client.admin.command("ping")
    except errors.ServerSelectionTimeoutError as e:
        # Connection timed out (TLS, network, IP whitelist)
        print("❌ Cannot connect to MongoDB Atlas at startup:", str(e))
        # Re-raise to fail startup so infra can detect it (optionally, comment out to allow degraded start)
        raise

    try:
        # Create unique index on number (idempotent)
        calls_collection.create_index("number", unique=True, background=True)
    except Exception as exc:
        # If index creation fails, log but do not necessarily crash
        print("⚠️ Warning: failed to create index at startup:", str(exc))


@app.on_event("shutdown")
def shutdown_db():
    try:
        client.close()
        print("🔌 MongoDB client closed.")
    except Exception:
        pass


# -------------------------
# Endpoint implementations
# -------------------------

# --- Create ---
@app.post("/calls")
def create_call(call: CallCreate):
    existing = calls_collection.find_one({"number": call.number})
    if existing:
        raise HTTPException(status_code=409, detail="Call record already exists")

    new_doc = {
        "receiver_first_name": call.receiver_first_name,
        "receiver_last_name": call.receiver_last_name,
        "number": call.number,
        "company": call.company,
        "description": call.description,
        "personal_notes": call.personal_notes or "",
        "call_sids": [],
        "recording_sids": [],
        "recording_urls": [],
        "recording_durations": [],
        "statuses": ["Not Called"],
        "created_at": datetime.utcnow(),
    }

    try:
        result = calls_collection.insert_one(new_doc)
    except errors.DuplicateKeyError:
        # Race condition: another process inserted same number
        raise HTTPException(status_code=409, detail="Call record already exists (duplicate)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB insert failed: {str(e)}")

    return {"message": "Call record created successfully", "id": str(result.inserted_id)}


# --- List All ---
@app.get("/calls")
def list_calls():
    docs = list(calls_collection.find().sort("created_at", -1))
    result = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        result.append(d)
    return result


# --- Search Functionality ---
@app.get("/calls/search")
def search_calls(
    name: Optional[str] = Query(None, description="Search by receiver first/last name or company"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    query = {}

    if name:
        query["$or"] = [
            {"receiver_first_name": {"$regex": name, "$options": "i"}},
            {"receiver_last_name": {"$regex": name, "$options": "i"}},
            {"company": {"$regex": name, "$options": "i"}},
        ]

    if status:
        query["statuses"] = status

    docs = list(calls_collection.find(query).sort("created_at", -1))
    results = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        results.append(d)
    return {"count": len(results), "results": results}


# --- View Single Record ---
@app.get("/calls/{call_id}")
def get_call(call_id: str):
    try:
        _id = ObjectId(call_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    call = calls_collection.find_one({"_id": _id})
    if not call:
        raise HTTPException(status_code=404, detail="Call record not found")

    call["id"] = str(call.pop("_id"))
    return call


# --- Update ---
@app.put("/calls/{call_id}")
def update_call(call_id: str, update: CallUpdate):
    try:
        _id = ObjectId(call_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    call = calls_collection.find_one({"_id": _id})
    if not call:
        raise HTTPException(status_code=404, detail="Call record not found")

    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        return {"message": "No fields to update"}

    status_value = update_data.pop("status", None)

    if update_data:
        try:
            calls_collection.update_one({"_id": _id}, {"$set": update_data})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"DB update failed: {str(e)}")

    if status_value:
        try:
            calls_collection.update_one({"_id": _id}, {"$push": {"statuses": status_value}})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"DB update failed: {str(e)}")

    return {
        "message": f"Call record {call_id} updated successfully",
        "updated_fields": list(update.dict(exclude_unset=True).keys())
    }


# --- Delete ---
@app.delete("/calls/{call_id}")
def delete_call(call_id: str):
    try:
        _id = ObjectId(call_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    try:
        result = calls_collection.delete_one({"_id": _id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB delete failed: {str(e)}")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Call record not found")

    return {"message": f"Call record {call_id} deleted successfully"}


# --- Twilio Recording Callback ---
@app.post("/recordings/callback")
async def recording_callback(request: Request):
    form = await request.form()
    call_sid = form.get("CallSid")
    recording_sid = form.get("RecordingSid")
    recording_url = form.get("RecordingUrl")
    recording_duration = form.get("RecordingDuration")
    status = form.get("RecordingStatus")

    to_number = (
        request.query_params.get("DestNumber")
        or form.get("To")
        or form.get("Called")
    )

    print(f"📞 Callback received for {to_number} | CallSid: {call_sid} | RecordingURL: {recording_url}")

    if not to_number:
        return {"message": "❌ No number found, callback ignored"}

    try:
        existing = calls_collection.find_one({"number": to_number})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB lookup failed: {str(e)}")

    if existing:
        try:
            # Remove placeholder 'Not Called' if exists
            if "Not Called" in existing.get("statuses", []):
                calls_collection.update_one({"_id": existing["_id"]}, {"$pull": {"statuses": "Not Called"}})

            # Update existing record by pushing event fields
            calls_collection.update_one(
                {"_id": existing["_id"]},
                {
                    "$push": {
                        "call_sids": call_sid,
                        "recording_sids": recording_sid,
                        "recording_urls": recording_url,
                        "recording_durations": recording_duration,
                        "statuses": status,
                    }
                }
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"DB update failed: {str(e)}")
    else:
        new_doc = {
            "receiver_first_name": "Unknown",
            "receiver_last_name": "",
            "number": to_number,
            "company": "",
            "description": "Auto-created via frontend call",
            "personal_notes": "",
            "call_sids": [call_sid],
            "recording_sids": [recording_sid],
            "recording_urls": [recording_url],
            "recording_durations": [recording_duration],
            "statuses": [status],
            "created_at": datetime.utcnow(),
        }
        try:
            calls_collection.insert_one(new_doc)
        except errors.DuplicateKeyError:
            # race: another process inserted simultaneously — try update instead
            calls_collection.update_one(
                {"number": to_number},
                {"$push": {
                    "call_sids": call_sid,
                    "recording_sids": recording_sid,
                    "recording_urls": recording_url,
                    "recording_durations": recording_duration,
                    "statuses": status,
                }}
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"DB insert failed: {str(e)}")

    print("✅ Callback processed successfully and saved to DB.")
    return {"message": "Callback processed successfully"}


# ========================
# 📁 Excel Upload / Delete
# ========================

@app.post("/calls/upload_excel")
async def upload_excel(file: UploadFile = File(...)):
    """Upload an Excel sheet (.xlsx) and insert its rows into MongoDB."""
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx files are supported")

    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))

        required_columns = ["receiver_first_name", "receiver_last_name", "number", "company", "description"]
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing required column: {col}")

        inserted = 0
        for _, row in df.iterrows():
            if not calls_collection.find_one({"number": str(row["number"])}):
                doc = {
                    "receiver_first_name": str(row["receiver_first_name"]),
                    "receiver_last_name": str(row["receiver_last_name"]),
                    "number": str(row["number"]),
                    "company": str(row["company"]),
                    "description": str(row["description"]),
                    "personal_notes": str(row.get("personal_notes", "")),
                    "call_sids": [],
                    "recording_sids": [],
                    "recording_urls": [],
                    "recording_durations": [],
                    "statuses": ["Not Called"],
                    "created_at": datetime.utcnow(),
                    "source": "excel_upload"
                }
                calls_collection.insert_one(doc)
                inserted += 1

        return {"message": f"{inserted} records inserted from Excel."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Excel: {str(e)}")


@app.delete("/calls/delete_excel")
def delete_excel_records():
    """Delete all records that were uploaded from Excel."""
    result = calls_collection.delete_many({"source": "excel_upload"})
    return {"message": f"{result.deleted_count} Excel-uploaded records deleted successfully."}
