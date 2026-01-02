from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas

router = APIRouter(
    prefix="/api/courses",
    tags=["courses"]
)

@router.get("/", response_model=List[schemas.Course])
def get_courses(
    skip: int = 0, 
    limit: int = 100, 
    branch_id: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Course)
    
    if branch_id or year:
        query = query.join(models.Subject)
        if branch_id:
            query = query.filter(models.Subject.branch_id == branch_id)
        if year:
            query = query.filter(models.Subject.year == year)
            
    courses = query.offset(skip).limit(limit).all()
    return courses

@router.post("/", response_model=schemas.Course, status_code=status.HTTP_201_CREATED)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@router.get("/{course_id}", response_model=schemas.CourseDetail)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.get("/lessons/{lesson_id}", response_model=schemas.Lesson)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.post("/{course_id}/enroll")
def enroll_course(course_id: int, db: Session = Depends(get_db)):
    user_id = 1 # Hardcoded for demo
    
    # Check existence
    existing = db.query(models.UserCourse).filter(
        models.UserCourse.user_id == user_id,
        models.UserCourse.course_id == course_id
    ).first()
    
    if existing:
        return {"message": "Already enrolled"}
        
    enrollment = models.UserCourse(user_id=user_id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully"}

@router.get("/{course_id}/status")
def get_enrollment_status(course_id: int, db: Session = Depends(get_db)):
    user_id = 1
    enrollment = db.query(models.UserCourse).filter(
        models.UserCourse.user_id == user_id,
        models.UserCourse.course_id == course_id
    ).first()
    return {"enrolled": enrollment is not None}

@router.get("/meta/branches")
def get_branches(db: Session = Depends(get_db)):
    branches = db.query(models.Branch).all()
    return branches
