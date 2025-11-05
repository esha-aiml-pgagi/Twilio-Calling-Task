from fastapi import FastAPI, Request, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import psycopg2
from datetime import datetime

# --- Database Config ---
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "call_center_db"
DB_USER = "call_user"
DB_PASSWORD = "yourpassword"

def get_conn():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

# --- FastAPI App ---
app = FastAPI(title="Call Center Backend", version="3.1")

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

# --- Initialize Table ---
def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS call_recordings (
        id SERIAL PRIMARY KEY,
        receiver_first_name TEXT,
        receiver_last_name TEXT,
        number TEXT UNIQUE,
        company TEXT,
        description TEXT,
        personal_notes TEXT,
        call_sids TEXT[],
        recording_sids TEXT[],
        recording_urls TEXT[],
        recording_durations TEXT[],
        statuses TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

# --- Create ---
@app.post("/calls")
def create_call(call: CallCreate):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id FROM call_recordings WHERE number = %s", (call.number,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=409, detail="Call record already exists")

    cur.execute("""
        INSERT INTO call_recordings (
            receiver_first_name, receiver_last_name, number, company, description, personal_notes,
            call_sids, recording_sids, recording_urls, recording_durations, statuses
        ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING id
    """, (
        call.receiver_first_name, call.receiver_last_name, call.number, call.company, call.description,
        call.personal_notes or "", [], [], [], [], ['Not Called']
    ))
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Call record created successfully", "id": new_id}

# --- List All ---
@app.get("/calls")
def list_calls():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM call_recordings ORDER BY created_at DESC")
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    result = [dict(zip(colnames, r)) for r in rows]
    cur.close()
    conn.close()
    return result

# --- View Single Record ---
@app.get("/calls/{call_id}")
def get_call(call_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM call_recordings WHERE id = %s", (call_id,))
    row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Call record not found")
    colnames = [desc[0] for desc in cur.description]
    result = dict(zip(colnames, row))
    cur.close()
    conn.close()
    return result

# --- Search Functionality ---
@app.get("/calls/search")
def search_calls(
    name: Optional[str] = Query(None, description="Search by receiver first/last name or company"),
    status: Optional[str] = Query(None, description="Filter by status")
):
    conn = get_conn()
    cur = conn.cursor()

    query = "SELECT * FROM call_recordings WHERE 1=1"
    params = []

    if name:
        query += " AND (receiver_first_name ILIKE %s OR receiver_last_name ILIKE %s OR company ILIKE %s)"
        like = f"%{name}%"
        params.extend([like, like, like])
    if status:
        query += " AND %s = ANY(statuses)"
        params.append(status)

    query += " ORDER BY created_at DESC"
    cur.execute(query, tuple(params))
    rows = cur.fetchall()
    colnames = [desc[0] for desc in cur.description]
    result = [dict(zip(colnames, r)) for r in rows]
    cur.close()
    conn.close()
    return {"count": len(result), "results": result}

# --- Update ---
@app.put("/calls/{call_id}")
def update_call(call_id: int, update: CallUpdate):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM call_recordings WHERE id = %s", (call_id,))
    record = cur.fetchone()
    if not record:
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Call record not found")

    update_data = update.dict(exclude_unset=True)
    if not update_data:
        cur.close()
        conn.close()
        return {"message": "No fields to update"}

    status_value = update_data.pop("status", None)

    set_clauses, values = [], []
    for field, value in update_data.items():
        set_clauses.append(f"{field} = %s")
        values.append(value)

    if set_clauses:
        values.append(call_id)
        sql = f"UPDATE call_recordings SET {', '.join(set_clauses)} WHERE id = %s"
        cur.execute(sql, values)

    if status_value:
        cur.execute("SELECT statuses FROM call_recordings WHERE id = %s", (call_id,))
        current_statuses = cur.fetchone()[0] or []
        current_statuses.append(status_value)
        cur.execute("UPDATE call_recordings SET statuses = %s WHERE id = %s", (current_statuses, call_id))

    conn.commit()
    cur.close()
    conn.close()
    return {"message": f"Call record {call_id} updated successfully", "updated_fields": list(update.dict(exclude_unset=True).keys())}

# --- Delete ---
@app.delete("/calls/{call_id}")
def delete_call(call_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id FROM call_recordings WHERE id = %s", (call_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Call record not found")

    cur.execute("DELETE FROM call_recordings WHERE id = %s", (call_id,))
    conn.commit()
    cur.close()
    conn.close()
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

    # The number Twilio called
    to_number = (
        request.query_params.get("DestNumber")
        or form.get("To")
        or form.get("Called")
    )

    print(f"📞 Callback received for {to_number} | CallSid: {call_sid} | RecordingURL: {recording_url}")

    if not to_number:
        return {"message": "❌ No number found, callback ignored"}

    conn = get_conn()
    cur = conn.cursor()

    # --- Try to find existing record for this number ---
    cur.execute("""
        SELECT id, call_sids, recording_sids, recording_urls, recording_durations, statuses 
        FROM call_recordings WHERE number = %s
    """, (to_number,))
    row = cur.fetchone()

    if row:
        # ✅ Update existing record
        record_id, call_sids, recording_sids, recording_urls, recording_durations, statuses = row

        # Initialize empty lists if any field is NULL
        call_sids = call_sids or []
        recording_sids = recording_sids or []
        recording_urls = recording_urls or []
        recording_durations = recording_durations or []
        statuses = statuses or []

        # Clean up placeholder
        if 'Not Called' in statuses:
            statuses.remove('Not Called')

        # Append latest details
        call_sids.append(call_sid)
        recording_sids.append(recording_sid)
        recording_urls.append(recording_url)
        recording_durations.append(recording_duration)
        statuses.append(status)

        # Update DB
        cur.execute("""
            UPDATE call_recordings
            SET call_sids=%s, recording_sids=%s, recording_urls=%s,
                recording_durations=%s, statuses=%s
            WHERE id=%s
        """, (call_sids, recording_sids, recording_urls, recording_durations, statuses, record_id))

    else:
        # ⚡️ Create new record automatically
        cur.execute("""
            INSERT INTO call_recordings (
                receiver_first_name, receiver_last_name, number, company, description, personal_notes,
                call_sids, recording_sids, recording_urls, recording_durations, statuses
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            "Unknown",              # receiver_first_name placeholder
            "",                     # receiver_last_name
            to_number,              # number
            "",                     # company
            "Auto-created via frontend call",  # description
            "",                     # personal_notes
            [call_sid],
            [recording_sid],
            [recording_url],
            [recording_duration],
            [status],
        ))

    conn.commit()
    cur.close()
    conn.close()

    print("✅ Callback processed successfully and saved to DB.")
    return {"message": "Callback processed successfully"}
