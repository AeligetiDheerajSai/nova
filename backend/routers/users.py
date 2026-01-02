from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from database import get_db
import models
import schemas
# from .auth import oauth2_scheme # In real app, protect these routes

router = APIRouter(prefix="/api/users", tags=["users"])

# Schemas
class BadgeSchema(BaseModel):
    name: str
    description: str
    icon_url: str
    earned: bool

class CertificateSchema(BaseModel):
    title: str
    issued_at: str
    image_url: str

@router.put("/me", response_model=schemas.UserResponse)
def update_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    # Hardcoded user ID 1
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.bio is not None:
        user.bio = user_update.bio
    if user_update.avatar_style is not None:
        user.avatar_style = user_update.avatar_style
        
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=schemas.UserResponse)
def get_my_profile(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    return user

@router.post("/progress", response_model=schemas.ProgressResponse)
def update_progress(progress: schemas.ProgressUpdate, db: Session = Depends(get_db)):
    user_id = 1 # Hardcoded for demo
    
    # Check if entry exists
    db_progress = db.query(models.UserProgress).filter(
        models.UserProgress.user_id == user_id, 
        models.UserProgress.lesson_id == progress.lesson_id
    ).first()
    
    if db_progress:
        db_progress.completed = progress.completed
        if progress.score is not None:
            db_progress.score = progress.score
    else:
        db_progress = models.UserProgress(
            user_id=user_id,
            lesson_id=progress.lesson_id,
            completed=progress.completed,
            score=progress.score
        )
        db.add(db_progress)
        
    db.commit()
    db.refresh(db_progress)
    return db_progress

@router.get("/progress/{course_id}", response_model=List[schemas.ProgressResponse])
def get_course_progress(course_id: int, db: Session = Depends(get_db)):
    user_id = 1
    # Get all lessons for this course to filter progress? 
    # Or just return all progress for user and let frontend filter? 
    # Better: return progress for user where lesson belongs to course.
    # Joining: UserProgress -> Lesson -> Module -> Course
    results = db.query(models.UserProgress).join(models.Lesson).join(models.Module).filter(
        models.UserProgress.user_id == user_id,
        models.Module.course_id == course_id
    ).all()
    return results

@router.get("/me/courses", response_model=List[schemas.Course])
def get_my_courses(db: Session = Depends(get_db)):
    user_id = 1
    # Join UserCourse to Course
    courses = db.query(models.Course).join(models.UserCourse).filter(
        models.UserCourse.user_id == user_id
    ).all()
    return courses
