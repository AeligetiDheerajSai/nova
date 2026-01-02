from database import SessionLocal
from models import Branch, Subject, Course

from sqlalchemy.orm import configure_mappers

def seed_academic():
    configure_mappers()
    db = SessionLocal()
    print("Seeding Branches and Subjects...")

    # 1. Define Branches
    branches = [
        {"name": "Computer Science & Engineering", "code": "CSE", "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"},
        {"name": "Electronics & Communication", "code": "ECE", "image": "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=1000"},
        {"name": "Mechanical Engineering", "code": "ME", "image": "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1000"},
        {"name": "Civil Engineering", "code": "CE", "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000"},
    ]

    for b_data in branches:
        branch = db.query(Branch).filter(Branch.code == b_data["code"]).first()
        if not branch:
            branch = Branch(name=b_data["name"], code=b_data["code"], image_url=b_data["image"])
            db.add(branch)
            db.commit()
            print(f"Created Branch: {branch.name}")
    
    # 2. Seed Subjects for CSE (Sample)
    cse = db.query(Branch).filter(Branch.code == "CSE").first()
    if cse:
        subjects_data = [
            {"title": "Introduction to Programming", "code": "CS101", "year": 1, "sem": 1},
            {"title": "Data Structures", "code": "CS201", "year": 2, "sem": 3},
            {"title": "Web Development", "code": "CS202", "year": 2, "sem": 4},
            {"title": "Artificial Intelligence", "code": "CS301", "year": 3, "sem": 5},
            {"title": "Computer Networks", "code": "CS302", "year": 3, "sem": 6},
        ]
        
        for s_data in subjects_data:
            subject = db.query(Subject).filter(Subject.code == s_data["code"]).first()
            if not subject:
                subject = Subject(title=s_data["title"], code=s_data["code"], branch_id=cse.id, year=s_data["year"], semester=s_data["sem"], description=f"Core {s_data['title']} course.")
                db.add(subject)
                db.commit()
                print(f"Created Subject: {subject.title}")

                # Link existing courses if they match
                if "Data Structures" in subject.title:
                    course = db.query(Course).filter(Course.title == "Data Structures & Algorithms").first()
                    if course: 
                        course.subject_id = subject.id
                        db.commit()
                        print(f"Linked Course to {subject.title}")
                
                if "Web Development" in subject.title:
                    course = db.query(Course).filter(Course.title == "Full Stack Web Development").first()
                    if course:
                        course.subject_id = subject.id
                        db.commit()
                        print(f"Linked Course to {subject.title}")

                if "Programming" in subject.title:
                     course = db.query(Course).filter(Course.title == "Python Mastery").first()
                     if course:
                         course.subject_id = subject.id
                         db.commit()
                         print(f"Linked Course to {subject.title}")

    # 3. Enhance with missing Lab Courses
    lab_courses = [
        {
            "title": "Quantum Chemistry 101",
            "description": "Explore molecular structures in VR.",
            "category": "Science",
            "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000"
        },
        {
            "title": "Applied Physics: Gravity",
            "description": "Classical mechanics simulation sandbox.",
            "category": "Science",
            "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000"
        },
        {
            "title": "Digital Logic Design",
            "description": "Build complex circuits with logic gates.",
            "category": "Electronics",
            "image": "https://images.unsplash.com/photo-1555664424-778a69633595?auto=format&fit=crop&q=80&w=1000"
        }
    ]

    for lc in lab_courses:
        course = db.query(Course).filter(Course.title == lc["title"]).first()
        if not course:
            course = Course(title=lc["title"], description=lc["description"], category=lc["category"], image_url=lc["image"])
            db.add(course)
            db.commit()
            print(f"Created Lab Course: {course.title}")

    print("Seeding Complete.")
    db.close()

if __name__ == "__main__":
    seed_academic()
