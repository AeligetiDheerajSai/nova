from database import engine
from sqlalchemy import text

def add_profile_columns():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN bio VARCHAR"))
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar_style VARCHAR DEFAULT 'adventurer'"))
            conn.commit()
            print("Successfully added bio and avatar_style columns.")
        except Exception as e:
            print(f"Error (columns might already exist): {e}")

if __name__ == "__main__":
    add_profile_columns()
