from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import time

from database import get_db, engine
import models
from routers import auth, users, courses, skills, resume


# Create tables if not exist (quick setup)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillTree AI API",
    description="Backend API for SkillTree AI Platform",
    version="0.2.0"
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(skills.router)
app.include_router(resume.router)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class Message(BaseModel):
    text: str
    sender: str # 'user' or 'ai'

class DashboardData(BaseModel):
    user: dict
    courses: List[dict]
    learningPaths: List[dict]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    action_link: Optional[str] = None
    action_text: Optional[str] = None

# --- Endpoints ---

@app.get("/")
async def root():
    return {"message": "Welcome to SkillTree AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/dashboard", response_model=DashboardData)
def get_dashboard(db: Session = Depends(get_db)):
    # Fetch real user (mocked ID 1 for now, in real app use current_user)
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        # Fallback for dev if seeding didn't run
        return {
            "user": {
                "name": "Guest", 
                "level": 0, 
                "xp": 0, 
                "streak": 0, 
                "badges": []
            }, 
            "courses": [], 
            "learningPaths": [
                { 
                  "id": "cse-cyber", 
                  "title": "Cyber Security Specialist", 
                  "progress": 0, 
                  "totalCourses": 5, 
                  "completedCourses": 0,
                  "currentCourse": "Start your journey"
                },
                { 
                  "id": "cse-ai", 
                  "title": "AI & Machine Learning Engineer", 
                  "progress": 0, 
                  "totalCourses": 6, 
                  "completedCourses": 0,
                  "currentCourse": "Start your journey"
                }
            ]
        }

    # Fetch courses
    courses_db = db.query(models.Course).all()
    
    # Build response
    courses_data = []
    for c in courses_db:
        courses_data.append({
            "id": c.id,
            "title": c.title,
            "category": c.category,
            "progress": 0, # In real app, query UserProgress table
            "totalModules": 10, # Mock constraint
            "completedModules": 0,
            "image": c.image_url
        })
        
    return {
        "user": {
            "name": user.username,
            "role": "student",
            "level": user.level,
            "xp": user.xp,
            "streak": user.streak_days,
            "badges": ["Packet Hunter", "Python Novice"] # Simplified for dashboard view
        },
        "courses": courses_data,
        "learningPaths": [
            { 
              "id": "cse-cyber", 
              "title": "Cyber Security Specialist", 
              "progress": 35, 
              "totalCourses": 5, 
              "completedCourses": 1,
              "currentCourse": "Network Defense Essentials"
            },
            { 
              "id": "cse-ai", 
              "title": "AI & Machine Learning Engineer", 
              "progress": 10, 
              "totalCourses": 6, 
              "completedCourses": 0,
              "currentCourse": "Neural Networks 101"
            }
        ]
    }

# --- Advanced Features ---

# Simple in-memory history for context (per user session would need a session ID, simplification for demo)
chat_history = []

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Simulate AI processing time
    time.sleep(0.5)
    
    msg = request.message.lower()
    chat_history.append(msg)
    
    response = ""
    
    action_link = None
    action_text = None

    if "hello" in msg or "hi" in msg:
        response = "Hello! I am your SkillTree AI instructor. I can help you master Cyber Security, Algorithms, or Web Dev. Try asking to 'visualize sorting' or 'build a circuit'!"
    elif "sort" in msg or "algorithm" in msg or "bubble" in msg:
        response = "Sorting algorithms are best understood visually. I can take you to the Sorting Algorithm Visualizer."
        action_link = "/lab/sorting-algo"
        action_text = "Launch Sorting Lab"
    elif "circuit" in msg or "logic" in msg or "gate" in msg:
        response = "Digital logic requires hands-on practice. Let's open the Circuit Builder to experiment with AND/OR gates."
        action_link = "/lab/circuit-logic"
        action_text = "Launch Circuit Builder"
    elif "network" in msg or "security" in msg:
        response = "Network security is a critical field. I recommend starting with our 'Network Defense Essentials' course."
        action_link = "/lab/network-defense"
        action_text = "Access Network Lab"
    elif "job" in msg or "career" in msg or "resume" in msg:
        response = "Based on your progress, you are on track for roles like 'Junior Security Analyst'. Upload your resume for a detailed analysis!"
    elif "help" in msg:
        response = "I can guide you through courses, launch AR/VR simulations, or analyze your career readiness. What would you like to do?"
    else:
        response = f"That's an interesting topic! As an AI instructor, I can help you find resources about '{request.message}'."
        
    return {"response": response, "action_link": action_link, "action_text": action_text}

