from database import engine, Base
import models

# Create all tables that don't exist
# This is a simple way to add new tables without full migration tool like Alembic
# For existing tables with new columns, it won't work, but for new tables it's fine.
def migrate():
    print("Migrating UserCourse table...")
    models.UserCourse.__table__.create(bind=engine, checkfirst=True)
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
