from database import engine, Base, SessionLocal
from models import User, Course, Module, Lesson, UserProgress, Badge, UserBadge, Certificate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if data exists
    if db.query(User).first():
        print("Database already seeded.")
        return

    print("DEBUG: VERSION 3 - Checking User class")
    import inspect
    print(inspect.signature(User.__init__))

    print("Creating User (Safe Mode)...")
    try:
        user = User()
        user.username = "student"
        user.email = "test@example.com"
        user.hashed_password = pwd_context.hash("password")
        
        db.add(user)
        db.commit() # Commit first to get ID
        db.refresh(user) 
    except Exception as e:
        print(f"FATAL ERROR Creating User: {e}")
        raise e

    # Set attributes
    user.is_active = True
    user.xp = 2450

    user.level = 5
    user.streak_days = 12

    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Create Courses
    c1 = Course(
        title="Network Defense Essentials",
        description="Learn firewall configuration and packet filtering.",
        category="Cyber Security",
        difficulty="Beginner",
        image_url="https://images.unsplash.com/photo-1558494949-efc5254848d2?auto=format&fit=crop&q=80&w=2574"
    )
    c2 = Course(
        title="Neural Networks 101",
        description="Build your first neural network from scratch.",
        category="AI",
        difficulty="Intermediate",
        image_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2565"
    )
    c3 = Course(
        title="Web3 Fundamentals",
        description="Introduction to Blockchain and Smart Contracts.",
        category="Web Dev",
        difficulty="Beginner",
        image_url="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2664"
    )
    db.add_all([c1, c2, c3])
    db.commit()

    # 3. Create Badges
    b1 = Badge(name="Packet Hunter", description="Completed Network Defense Lab", icon_url="Shield")
    b2 = Badge(name="Python Novice", description="Finished Python Basics", icon_url="Cpu")
    b3 = Badge(name="AI Architect", description="Build a Neural Network", icon_url="Brain")
    db.add_all([b1, b2, b3])
    db.commit()
    
    # 4. Assign Badges to User
    ub1 = UserBadge(user_id=user.id, badge_id=b1.id)
    ub2 = UserBadge(user_id=user.id, badge_id=b2.id)
    db.add_all([ub1, ub2])
    db.commit()

    # 5. Create Skills (New)
    from models import Skill
    s1 = Skill(name="Python", category="Backend")
    s2 = Skill(name="Network Security", category="Cyber Security")
    s3 = Skill(name="React", category="Frontend")
    s4 = Skill(name="Algorithms", category="CSE")
    
    db.add_all([s1, s2, s3, s4])
    db.commit()

    print("Tables created and seeded successfully.")
    db.close()


if __name__ == "__main__":
    init_db()
