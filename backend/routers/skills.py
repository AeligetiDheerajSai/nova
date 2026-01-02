from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from routers.auth import get_current_user

router = APIRouter(
    prefix="/api/skills",
    tags=["skills"]
)

@router.get("/", response_model=List[schemas.Skill])
def get_all_skills(db: Session = Depends(get_db)):
    return db.query(models.Skill).all()

@router.post("/", response_model=schemas.Skill)
def create_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db)):
    db_skill = models.Skill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.get("/me", response_model=List[schemas.UserSkill])
def get_my_skills(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user.skills

@router.post("/me", response_model=schemas.UserSkill)
def add_user_skill(skill_data: schemas.UserSkillCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if user already has this skill
    exists = db.query(models.UserSkill).filter(
        models.UserSkill.user_id == current_user.id,
        models.UserSkill.skill_id == skill_data.skill_id
    ).first()
    
    if exists:
        exists.proficiency = skill_data.proficiency
        db.commit()
        db.refresh(exists)
        return exists
        
    user_skill = models.UserSkill(
        user_id=current_user.id,
        skill_id=skill_data.skill_id,
        proficiency=skill_data.proficiency,
        verified=skill_data.verified
    )
    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)
    return user_skill
