import os
from sqlalchemy import create_engine, engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


url_bd = engine.url.URL.create(
    # Equivalent URL:
    # postgresql+pg8000://<db_user>:<db_pass>@<db_host>:<db_port>/<db_name>
    drivername=os.environ["DB_DRIVER"],
    username=os.environ["DB_USER"],  # e.g. "my-database-user"
    password=os.environ["DB_PASS"],  # e.g. "my-database-password"
    database=os.environ["DB_NAME"],  # e.g. "my-database-name"
    host=os.environ["DB_URL"],  # e.g. "127.0.0.1"
    port=os.environ["DB_PORT"],  # e.g. 5432
)

engine = create_engine(url_bd)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
