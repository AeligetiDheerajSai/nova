from database import SessionLocal
from models import Skill

def seed_skills():
    db = SessionLocal()
    
    skills = [
        {"name": "Python", "category": "Backend"},
        {"name": "Network Security", "category": "Cyber Security"},
        {"name": "React", "category": "Frontend"},
        {"name": "Algorithms", "category": "CSE"},
        {"name": "Digital Logic", "category": "CSE"}
    ]

    print("Seeding skills...")
    for s_data in skills:
        exists = db.query(Skill).filter(Skill.name == s_data["name"]).first()
        if not exists:
            skill = Skill(**s_data)
            db.add(skill)
            print(f"Added skill: {s_data['name']}")
        else:
             print(f"Skill {s_data['name']} already exists.")
    
    db.commit()
    print("Skills seeded.")
    db.close()

if __name__ == "__main__":
    seed_skills()
