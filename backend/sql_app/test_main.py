from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

# PING TESTS


def test_ping():
    response = client.get("/ping/")
    assert response.status_code == 200
    assert response.json() == {"ping": "pong"}


# PASSWORD TESTS

def test_login_ok():
    response = client.post("api/auth/user/password/reset/token",
                           json={
                               "formFields": [
                                   {
                                       "id": "email",
                                       "value": "test_demo@uniovi.es"
                                   }
                               ]
                           })
    assert response.status_code == 200
    assert response.json()['status'] == "OK"


def test_login_ko():
    response = client.post("api/auth/user/password/reset/token")
    assert response.status_code == 400
    assert response.json()[
        'message'] == "Are you sending too many / too few formFields?"


# LOGIN TESTS

def test_login_ko_no_data():
    response = client.post("api/auth/signin")
    assert response.status_code == 400
    assert response.json()[
        'message'] == "Are you sending too many / too few formFields?"


def test_login_ko_credentials():
    response = client.post("api/auth/signin",
                           json={
                               "formFields": [
                                   {
                                       "id": "email",
                                       "value": "test_demo@uniovi.es"
                                   },
                                   {
                                       "id": "password",
                                       "value": "no_existe_12345"
                                   }
                               ]
                           })
    assert response.status_code == 200
    assert response.json()['status'] == "WRONG_CREDENTIALS_ERROR"


def test_login_ok():
    response = client.post("api/auth/signin",
                           json={
                               "formFields": [
                                {
                                    "id": "email",
                                    "value": "test_demo@uniovi.es"
                                },
                                   {
                                    "id": "password",
                                    "value": "a12345678"
                                }
                               ]
                           })
    assert response.status_code == 200
    assert response.json()['status'] == "OK"

# TEAMS TESTS


def test_create_team_ok():
    response = client.post("/teams/",
                           json={"name": "Equipo demo test"})
    assert response.status_code == 200
    assert response.json() == {}


def test_create_team_ko_no_name():
    response = client.post("/teams/")
    assert response.status_code == 422
    assert response.json() == {'detail': [{'loc': ['body'],
                                           'msg': 'field required',
                                           'type': 'value_error.missing'}]}


# STUDIES TESTS

def test_create_studie_ok():
    response = client.post("/studies/",
                           json={
                               "private_studie_title": "Estudio TEST python",
                               "public_studie_title": "Estudio demo TEST",
                               "studie_description": "Estudio interno para tests python",
                               "audience_max": "50",
                               "team_id": ""
                           })
    assert response.status_code == 200
    assert response.json()['name'] == "Estudio TEST python"
    assert response.json()['public_studie_title'] == "Estudio demo TEST"
    assert response.json()['audience_max'] == 50
    assert response.json()['is_active'] == True
    assert response.json()['is_published'] == False

def test_create_studie_ko_no_data():
    response = client.post("/studies/")
    assert response.status_code == 422
    assert response.json() == {'detail': [{'loc': ['body'],
                                           'msg': 'field required',
                                           'type': 'value_error.missing'}]}
