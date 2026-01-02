from database import engine
import models

def migrate():
    print("Migrating Academic Tables (Branches, Subjects)...")
    models.Branch.__table__.create(bind=engine, checkfirst=True)
    models.Subject.__table__.create(bind=engine, checkfirst=True)
    
    # Check if 'subject_id' column exists in 'courses' table, if not add it (sqlite specific)
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE courses ADD COLUMN subject_id INTEGER REFERENCES subjects(id)"))
            print("Added subject_id to courses.")
        except Exception as e:
            print(f"Column likely exists or error: {e}")

    print("Migration complete.")

if __name__ == "__main__":
    migrate()
