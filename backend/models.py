from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

class UserRole(str, enum.Enum):
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
    bio = Column(String, nullable=True)
    avatar_style = Column(String, default="adventurer") # default seed for DiceBear
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    progress = relationship("UserProgress", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")
    courses = relationship("UserCourse", back_populates="user")
    skills = relationship("UserSkill", back_populates="user")

class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g. "Computer Science & Engineering"
    code = Column(String, unique=True, index=True) # e.g. "CSE"
    image_url = Column(String, nullable=True)

    subjects = relationship("Subject", back_populates="branch")

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    code = Column(String, index=True) # e.g. "CS201"
    branch_id = Column(Integer, ForeignKey("branches.id"))
    year = Column(Integer) # 1, 2, 3, 4
    semester = Column(Integer) # 1-8
    description = Column(String)
    
    branch = relationship("Branch", back_populates="subjects")
    courses = relationship("Course", back_populates="subject")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String) # Legacy category, keep for now
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True) # Link to academic subject
    image_url = Column(String, nullable=True)
    duration = Column(String, default="8 weeks")
    rating = Column(Float, default=4.5)
    
    subject = relationship("Subject", back_populates="courses")
    modules = relationship("Module", back_populates="course")

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    order = Column(Integer)

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module")

class LessonType(str, enum.Enum):
    VIDEO = "video"
    TEXT = "text"
    QUIZ = "quiz"
    SIMULATION = "simulation"

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"))
    title = Column(String)
    content_type = Column(String) # video, text, simulation
    content_url = Column(String, nullable=True) # URL or path to simulation component
    duration_minutes = Column(Integer, default=10)
    
    module = relationship("Module", back_populates="lessons")
    progress = relationship("UserProgress", back_populates="lesson")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)
    score = Column(Integer, nullable=True) # For quizzes or sims
    last_accessed = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    icon_url = Column(String)
    criteria = Column(String) # JSON or text describing how to get it

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    badge_id = Column(Integer, ForeignKey("badges.id"))
    awarded_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    certificate_url = Column(String) # PDF link

    user = relationship("User", back_populates="certificates")
    course = relationship("Course")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String) # Frontend, Backend, Security
    
class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    proficiency = Column(Integer, default=0) # 0-100
    verified = Column(Boolean, default=False)

    user = relationship("User", back_populates="skills")
    skill = relationship("Skill")


class UserCourse(Base):
    __tablename__ = "user_courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    progress_percent = Column(Integer, default=0)

    user = relationship("User", back_populates="courses")
    course = relationship("Course")


