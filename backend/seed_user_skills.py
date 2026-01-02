from database import SessionLocal
from models import User, Skill, UserSkill

def seed_user_skills():
    db = SessionLocal()
    
    # Get test user
    user = db.query(User).filter(User.username == "student").first()
    if not user:
        print("User not found!")
        return

    # Get skills
    skills = db.query(Skill).all()
    if not skills:
        print("No skills found. Run seed_skills.py first.")
        return

    # Assign some skills
    # Let's assign Python (80%), React (45%), Network Security (60%)
    
    assignments = [
        {"name": "Python", "proficiency": 80},
        {"name": "React", "proficiency": 45},
        {"name": "Network Security", "proficiency": 60}
    ]

    print(f"Seeding skills for {user.username}...")
    
    for assign in assignments:
        skill = next((s for s in skills if s.name == assign["name"]), None)
        if skill:
            exists = db.query(UserSkill).filter(
                UserSkill.user_id == user.id,
                UserSkill.skill_id == skill.id
            ).first()
            
            if not exists:
                us = UserSkill(
                    user_id=user.id,
                    skill_id=skill.id,
                    proficiency=assign["proficiency"],
                    verified=True
                )
                db.add(us)
                print(f"Assigned {skill.name}")
            else:
                print(f"Already has {skill.name}")

    db.commit()
    print("User skills seeded.")
    db.close()

if __name__ == "__main__":
    seed_user_skills()
