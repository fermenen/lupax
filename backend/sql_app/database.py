import os
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


db_user = os.environ["DB_USER"]
db_pass = os.environ["DB_PASS"]
db_name = os.environ["DB_NAME"]
db_socket_dir = os.environ.get("DB_SOCKET_DIR", "/cloudsql")
instance_connection_name = os.environ["INSTANCE_CONNECTION_NAME"]


if(db_socket_dir=='/cloudsql'):
    url_bd = sqlalchemy.engine.url.URL.create(
        # Equivalent URL:
        # postgresql+pg8000://<db_user>:<db_pass>@/<db_name>?unix_sock=<socket_path>/<cloud_sql_instance_name>/.s.PGSQL.5432
        drivername="postgresql+pg8000",
        username=db_user,  # e.g. "my-database-user"
        password=db_pass,  # e.g. "my-database-password"
        database=db_name,  # e.g. "my-database-name"
        query={
            "unix_sock": "{}/{}/.s.PGSQL.5432".format(
                db_socket_dir,  # e.g. "/cloudsql"
                instance_connection_name)  # i.e "<PROJECT-NAME>:<INSTANCE-REGION>:<INSTANCE-NAME>"
        }
    )
else:
    url_bd = sqlalchemy.engine.url.URL.create(
        # Equivalent URL:
        # postgresql+pg8000://<db_user>:<db_pass>@<db_host>:<db_port>/<db_name>
        drivername="postgresql+pg8000",
        username=db_user,  # e.g. "my-database-user"
        password=db_pass,  # e.g. "my-database-password"
        database=db_name,  # e.g. "my-database-name"
        host=instance_connection_name,  # e.g. "127.0.0.1"
        port=5432,  # e.g. 5432
        
    )

engine = sqlalchemy.create_engine(url_bd)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
