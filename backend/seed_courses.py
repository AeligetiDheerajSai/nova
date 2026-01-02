from database import SessionLocal
from models import Course, Module, Lesson

def seed_content():
    db = SessionLocal()
    print("Seeding LMS content...")

    # 1. Ensure Python Course Exists (or get it)
    py_course = db.query(Course).filter(Course.title == "Python Mastery").first()
    if not py_course:
        py_course = Course(
            title="Python Mastery", 
            description="Complete Python Guide", 
            category="Programming", 
            image_url="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1000"
        )
        db.add(py_course)
        db.commit()
        db.refresh(py_course)
        print("Created Python Course")
    
    # 2. Add Modules to Python Course
    # Check if module exists
    mod_intro = db.query(Module).filter(Module.title == "Introduction to Python", Module.course_id == py_course.id).first()
    if not mod_intro:
        mod_intro = Module(title="Introduction to Python", order=1, course_id=py_course.id)
        db.add(mod_intro)
        db.commit()
        db.refresh(mod_intro)
        print("Created Module: Introduction")

        # Add Lessons
        lessons = [
            Lesson(title="Setting Up Environment", content_type="video", duration_minutes=15, content_url="https://www.youtube.com/embed/Y8Tko2YC5hA", module_id=mod_intro.id),
            Lesson(title="Hello World & Variables", content_type="text", duration_minutes=10, content_url="Welcome to Python! In this lesson...", module_id=mod_intro.id),
            Lesson(title="Python Basics Quiz", content_type="quiz", duration_minutes=5, content_url='{"questions": [{"q": "What is the output of print(2+2)?", "options": ["3", "4", "22", "Error"], "a": 1}, {"q": "Which keyword is used for functions?", "options": ["func", "def", "function", "lambda"], "a": 1}]}', module_id=mod_intro.id)
        ]
        db.add_all(lessons)
        db.commit()
        print("Added Intro Lessons")

    mod_dsa = db.query(Module).filter(Module.title == "Data Structures", Module.course_id == py_course.id).first()
    if not mod_dsa:
        mod_dsa = Module(title="Data Structures", order=2, course_id=py_course.id)
        db.add(mod_dsa)
        db.commit()
        db.refresh(mod_dsa)

        lessons_dsa = [
            Lesson(title="Lists and Tuples", content_type="video", duration_minutes=20, content_url="https://www.youtube.com/embed/ohCDWZgNIU0", module_id=mod_dsa.id),
            Lesson(title="Sorting Algorithm Lab", content_type="simulation", duration_minutes=30, content_url="/lab/sorting", module_id=mod_dsa.id)
        ]
        db.add_all(lessons_dsa)
        db.commit()
        print("Added DSA Lessons")

    # 3. Web Dev Course Content
    web_course = db.query(Course).filter(Course.title == "Full Stack Web Development").first()
    if web_course:
         mod_web_intro = db.query(Module).filter(Module.title == "HTML & CSS Basics", Module.course_id == web_course.id).first()
         if not mod_web_intro:
             mod_web_intro = Module(title="HTML & CSS Basics", order=1, course_id=web_course.id)
             db.add(mod_web_intro)
             db.commit()
             db.refresh(mod_web_intro)
             
             db.add(Lesson(title="Web Dev Lab", content_type="simulation", duration_minutes=45, content_url="/lab/web-dev", module_id=mod_web_intro.id))
             db.commit()
             print("Added Web Dev Lab Lesson")

    print("Seeding Complete!")
    db.close()

if __name__ == "__main__":
    seed_content()
