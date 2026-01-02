from database import engine, Base, SessionLocal
from models import User, Course, Module, Lesson, UserProgress, Badge, UserBadge, Certificate
from passlib.context import CryptContext

def init_db_force():
    db = SessionLocal()
    print("Checking for required courses...")

    # Network Defense Essentials (Cyber Security Lab)
    c1 = db.query(Course).filter(Course.title == "Network Defense Essentials").first()
    if not c1:
        print("Creating 'Network Defense Essentials'...")
        c1 = Course(
            title="Network Defense Essentials",
            description="Learn firewall configuration and packet filtering.",
            category="Cyber Security",
            image_url="https://images.unsplash.com/photo-1558494949-efc5254848d2?auto=format&fit=crop&q=80&w=2574"
        )
        db.add(c1)
    else:
        print("Found 'Network Defense Essentials'.")

    # Neural Networks 101 (AI Lab)
    c2 = db.query(Course).filter(Course.title == "Neural Networks 101").first()
    if not c2:
        print("Creating 'Neural Networks 101'...")
        c2 = Course(
            title="Neural Networks 101",
            description="Build your first neural network from scratch.",
            category="AI",
            image_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=2565"
        )
        db.add(c2)
    else:
        print("Found 'Neural Networks 101'.")
        
    db.commit()
    print("Force Link Check Complete.")
    db.close()

if __name__ == "__main__":
    init_db_force()
