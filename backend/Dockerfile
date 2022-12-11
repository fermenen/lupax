FROM python:3.8

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
#COPY ./lupax-app-google.json /code/lupax-app-google.json
COPY ./alembic.ini /code/alembic.ini

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./sql_app /code/sql_app
COPY ./alembic /code/alembic

CMD alembic upgrade head && uvicorn sql_app.main:app --host 0.0.0.0 --port $PORT