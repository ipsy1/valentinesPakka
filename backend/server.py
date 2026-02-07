from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class DayProgress(BaseModel):
    day_number: int
    day_name: str
    is_unlocked: bool
    is_completed: bool
    completion_time: Optional[datetime] = None

class UserProgress(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    days: List[DayProgress]
    replay_mode: bool = False
    all_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CompleteDay(BaseModel):
    day_number: int

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Valentine's Week App API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Valentine's Week Progress Routes
@api_router.get("/progress")
async def get_progress():
    """Get user progress for Valentine's Week"""
    progress = await db.valentine_progress.find_one({})
    
    if not progress:
        # Initialize progress with all 8 days
        days_data = [
            {"day_number": 1, "day_name": "Rose Day", "is_unlocked": True, "is_completed": False, "completion_time": None},
            {"day_number": 2, "day_name": "Propose Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
            {"day_number": 3, "day_name": "Chocolate Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
            {"day_number": 4, "day_name": "Teddy Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
            {"day_number": 5, "day_name": "Promise Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
            {"day_number": 6, "day_name": "Hug Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
            {"day_number": 7, "day_name": "Kiss Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
            {"day_number": 8, "day_name": "Valentine's Day", "is_unlocked": False, "is_completed": False, "completion_time": None},
        ]
        
        progress_data = {
            "user_id": str(uuid.uuid4()),
            "days": days_data,
            "replay_mode": False,
            "all_completed": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.valentine_progress.insert_one(progress_data)
        progress = progress_data
    
    # Convert MongoDB _id to string
    if "_id" in progress:
        progress["_id"] = str(progress["_id"])
    
    return progress

@api_router.post("/progress/complete")
async def complete_day(data: CompleteDay):
    """Mark a day as completed and unlock the next day"""
    progress = await db.valentine_progress.find_one({})
    
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    day_index = data.day_number - 1
    
    if day_index < 0 or day_index >= len(progress["days"]):
        raise HTTPException(status_code=400, detail="Invalid day number")
    
    # Mark current day as completed
    progress["days"][day_index]["is_completed"] = True
    progress["days"][day_index]["completion_time"] = datetime.utcnow()
    
    # Unlock next day if exists
    if day_index + 1 < len(progress["days"]):
        progress["days"][day_index + 1]["is_unlocked"] = True
    
    # Check if all days are completed
    all_completed = all(day["is_completed"] for day in progress["days"])
    if all_completed:
        progress["all_completed"] = True
        progress["replay_mode"] = True
        # Unlock all days for replay
        for day in progress["days"]:
            day["is_unlocked"] = True
    
    progress["updated_at"] = datetime.utcnow()
    
    await db.valentine_progress.update_one(
        {},
        {"$set": progress}
    )
    
    if "_id" in progress:
        progress["_id"] = str(progress["_id"])
    
    return progress

@api_router.post("/progress/reset")
async def reset_progress():
    """Reset progress (for testing)"""
    await db.valentine_progress.delete_many({})
    return {"message": "Progress reset successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
