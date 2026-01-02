from sqlalchemy import create_engine, inspect

SQLALCHEMY_DATABASE_URL = "sqlite:///./skilltree.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

inspector = inspect(engine)
columns = inspector.get_columns('skills')
print("Columns in skills table:")
for column in columns:
    print(f"- {column['name']}")
