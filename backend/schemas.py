from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    category: str

class SkillCreate(SkillBase):
    pass

class Skill(SkillBase):
    id: int
    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    title: str
    description: str
    category: str
    image_url: Optional[str] = None
    difficulty: str = "Beginner"
    duration: str = "Self-paced"
    rating: float = 0.0

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    class Config:
        orm_mode = True

class LessonBase(BaseModel):
    title: str
    content_type: str
    duration_minutes: int

class Lesson(LessonBase):
    id: int
    class Config:
        orm_mode = True

class ModuleBase(BaseModel):
    title: str
    order: int

class Module(ModuleBase):
    id: int
    lessons: List[Lesson] = []
    class Config:
        orm_mode = True

class CourseDetail(Course):
    modules: List[Module] = []

class UserSkillBase(BaseModel):
    proficiency: int
    verified: bool

class UserSkillCreate(UserSkillBase):
    skill_id: int

class UserSkill(UserSkillBase):
    id: int
    skill: Skill
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    bio: Optional[str] = None
    avatar_style: Optional[str] = None

class UserResponse(BaseModel):
    username: str
    email: str
    role: str
    bio: Optional[str] = None
    avatar_style: str
    xp: int
    level: int
    streak_days: int

class ProgressUpdate(BaseModel):
    lesson_id: int
    completed: bool
    score: Optional[int] = None

class ProgressResponse(BaseModel):
    lesson_id: int
    completed: bool
    score: Optional[int]
    last_accessed: datetime
    class Config:
        orm_mode = True
