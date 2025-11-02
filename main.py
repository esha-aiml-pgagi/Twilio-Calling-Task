# main.py
from fastapi import FastAPI, Request
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

# --- Database Configuration ---
DATABASE_URL = "sqlite:///./call_center.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# --- Model ---
class CallRecording(Base):
    __tablename__ = "call_recordings"

    id = Column(Integer, primary_key=True, index=True)
    call_sid = Column(String, index=True)
    recording_sid = Column(String, index=True)
    recording_url = Column(String)
    recording_duration = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# --- FastAPI App ---
app = FastAPI(title="Call Center Backend", version="1.0")

@app.post("/recordings/callback")
async def recording_callback(request: Request):
    """Receives Twilio's recording status callbacks."""
    form = await request.form()

    call_sid = form.get("CallSid")
    recording_sid = form.get("RecordingSid")
    recording_url = form.get("RecordingUrl")
    recording_duration = form.get("RecordingDuration")
    status = form.get("RecordingStatus")

    db = SessionLocal()
    db_record = CallRecording(
        call_sid=call_sid,
        recording_sid=recording_sid,
        recording_url=recording_url,
        recording_duration=recording_duration,
        status=status,
    )
    db.add(db_record)
    db.commit()
    db.close()

    print(f"✅ Saved recording for {call_sid}: {recording_url}")
    return {"message": "Recording data saved successfully"}

@app.get("/recordings")
def list_recordings():
    """List all saved recordings."""
    db = SessionLocal()
    recordings = db.query(CallRecording).all()
    db.close()
    return recordings
