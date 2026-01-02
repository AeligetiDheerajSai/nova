from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import time

from database import get_db
import models

router = APIRouter(
    prefix="/api/resume",
    tags=["resume"]
)

class JobRecommendation(BaseModel):
    title: str
    company: str
    location: str
    salary_range: str
    match_score: int

class ResumeAnalysisResponse(BaseModel):
    score: int
    match_role: str
    missing_skills: List[str]
    recommendation: str
    recommended_jobs: List[JobRecommendation] = []

@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Simulating resume parsing latency
    time.sleep(1.5)
    
    # In a real implementation:
    # 1. Read file content: content = await file.read()
    # 2. Extract text (PDF/Docx)
    # 3. NLP to extract skills
    
    # Mock Logic:
    # We will just return a mocked analysis that drives the user to the new content
    
    # Fetch all skills to "compare" against (mock)
    all_skills = db.query(models.Skill).all()
    
    return {
        "score": 75,
        "match_role": "Junior Security Analyst",
        "missing_skills": ["Network Forensics", "Advanced Python", "Penetration Testing"],
        "recommendation": "Based on your resume, we recommend enrolling in the 'Cyber Security Specialist' path to bridge the gap.",
        "recommended_jobs": [
            {
                "title": "Junior SOC Analyst",
                "company": "CyberGuard Solutions",
                "location": "Remote",
                "salary_range": "$70k - $90k",
                "match_score": 85
            },
            {
                "title": "Network Security Intern",
                "company": "TechCorp",
                "location": "San Francisco, CA",
                "salary_range": "$60k - $75k",
                "match_score": 92
            },
            {
                "title": "IT Security Associate",
                "company": "FinSecure Bank",
                "location": "New York, NY",
                "salary_range": "$80k - $100k",
                "match_score": 70
            }
        ]
    }
