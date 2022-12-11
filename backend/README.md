# lupax. API

Project that provides the lupax api


## Getting started


With poetry:

```bash

poetry install

poetry add <dependencie>

poetry run uvicorn sql_app.main:app --reload

```


With docker:

```bash

docker build --tag lupax-app .

docker run --env-file .env --add-host host.docker.internal:host-gateway lupax-app

```


For export requirements:

```bash
poetry export -f requirements.txt --output requirements.txt

```


For create migration:

```bash
alembic revision --autogenerate -m "text"

alembic upgrade head

```


## Resources

* [Official Website]
* [poetry]
* [FastAPI]
* [SQLAlchemy]
* [supertokens-python]
* [alembic]

  
[Official Website]: https://lupax.app/
[poetry]: https://github.com/python-poetry/poetry
[FastAPI]: https://github.com/tiangolo/fastapi
[SQLAlchemy]: https://www.sqlalchemy.org/
[supertokens-python]: https://github.com/supertokens/supertokens-python
[alembic]: https://alembic.sqlalchemy.org/en/latest/


## Contact us

For any queries, or support requests, please email us at support@lupax.app

## Authors

Fernando Menéndez Menéndez - UO251800@uniovi.es
