from database import SessionLocal
from models import User
from passlib.context import CryptContext

def ensure_user():
    db = SessionLocal()
    user = db.query(User).filter(User.username == "student").first()
    
    if user:
        print("User 'student' exists.")
    else:
        print("User 'student' missing. Creating now...")
        pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
        
        # Manually create using simplest method
        user = User()
        user.username = "student"
        user.email = "test@example.com"
        user.hashed_password = pwd_context.hash("password")
        user.is_active = True
        user.xp = 2450
        user.level = 5
        user.streak_days = 12
        
        db.add(user)
        db.commit()
        print("User 'student' created.")
    
    db.close()

if __name__ == "__main__":
    ensure_user()
