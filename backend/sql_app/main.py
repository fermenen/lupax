import os
import datetime
import requests
import sentry_sdk
from fastapi import FastAPI
from sqlalchemy import sql
from typing import List, Dict, Any, Union
from starlette.middleware.cors import CORSMiddleware
from supertokens_python import init, get_all_cors_headers, InputAppInfo, SupertokensConfig
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python.recipe import thirdpartyemailpassword, session, dashboard
from supertokens_python.recipe.thirdpartyemailpassword import Google
from supertokens_python.recipe.thirdpartyemailpassword.interfaces import APIInterface, ThirdPartyAPIOptions, ThirdPartySignInUpPostOkResult, EmailPasswordAPIOptions, EmailPasswordSignUpPostOkResult, EmailPasswordSignUpPostEmailAlreadyExistsError
from supertokens_python.recipe.thirdparty.provider import Provider
from supertokens_python.recipe.emailpassword import InputFormField
from supertokens_python.recipe.emailpassword.types import FormField

from .routers import studies, users, teams, tasks, participation, admin, storage, notifications
from .services import users_service
from .models import models
from .config.database import engine


sentry_sdk.init(os.environ.get('DSN_GLITCHTIP'))

tags_metadata = [
    {
        "name": "Public API lupax",
        "description": "Operations with **studies**.",
    },
]
contact = {
    "name": "lupax",
    "url": "https://lupax.app",
    "email": "hello@lupax.app",
}


def apis_override(original_implementation: APIInterface):
    original_thirdparty_sign_in_up_post = original_implementation.thirdparty_sign_in_up_post
    original_sign_up_post = original_implementation.emailpassword_sign_up_post

    async def thirdparty_sign_in_up_post(provider: Provider, code: str, redirect_uri: str, client_id: Union[str, None], auth_code_response: Union[Dict[str, Any], None],
                                         api_options: ThirdPartyAPIOptions, user_context: Dict[str, Any]):

        response = await original_thirdparty_sign_in_up_post(provider, code, redirect_uri, client_id, auth_code_response, api_options, user_context)

        if isinstance(response, ThirdPartySignInUpPostOkResult):
            if (response.created_new_user):
                thirdparty_auth_response = response.auth_code_response
                if thirdparty_auth_response is None:
                    raise Exception("Should never come here")
                resp = requests.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token={}&alt=json'.format(
                    thirdparty_auth_response["access_token"]))
                data_google = resp.json()
                users_service.create_user(user_supertokens=response.user, name=data_google['given_name'], last_name=data_google['family_name'], picture=data_google['picture'])

        return response

    async def emailpassword_sign_up_post(form_fields: List[FormField], api_options: EmailPasswordAPIOptions, user_context: Dict[str, Any]) -> Union[EmailPasswordSignUpPostOkResult, EmailPasswordSignUpPostEmailAlreadyExistsError]:
        response = await original_sign_up_post(form_fields, api_options, user_context)
        if response.status == 'OK' and response.user:
            name = ''
            last_name = ''
            for field in form_fields:
                if field.id == 'name':
                    name = field.value
                elif field.id == 'last_name':
                    last_name = field.value
            users_service.create_user(user_supertokens=response.user, name=name, last_name=last_name)
        return response

    original_implementation.thirdparty_sign_in_up_post = thirdparty_sign_in_up_post
    original_implementation.emailpassword_sign_up_post = emailpassword_sign_up_post
    return original_implementation


init(
    app_info=InputAppInfo(
        app_name="lupax",
        api_domain=os.environ.get('API_DOMAIN'),
        website_domain=os.environ.get('ALLOW_ORIGIN'),
        api_base_path="/api/auth",
        website_base_path="/auth"
    ),
    supertokens_config=SupertokensConfig(
        connection_uri=os.environ.get('URI_SUPERTOKEN'),
        api_key=os.environ.get('API_SUPERTOKEN')
    ),
    framework='fastapi',
    recipe_list=[
        session.init(),  # initializes session features
        dashboard.init(api_key=os.environ.get('API_SUPERTOKEN')),
        thirdpartyemailpassword.init(
            sign_up_feature=thirdpartyemailpassword.InputSignUpFeature(
                form_fields=[InputFormField(id='name'), InputFormField(
                    id='last_name', optional=True)]
            ),
            override=thirdpartyemailpassword.InputOverrideConfig(
                apis=apis_override
            ),
            providers=[
                Google(
                    client_id=os.environ.get('CLIENT_ID_AUTH'),
                    client_secret=os.environ.get('CLIENT_SECRET_AUTH'),
                    scope=["https://www.googleapis.com/auth/userinfo.email",
                           "https://www.googleapis.com/auth/userinfo.profile"]
                )
            ]
        ),
    ],
    mode='asgi'  # use wsgi if you are running using gunicorn
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lupax API", contact=contact,
              docs_url="/documentation", redoc_url=None, openapi_tags=tags_metadata)


app.add_middleware(get_middleware())

app.include_router(studies.router)
app.include_router(users.router)
app.include_router(teams.router)
app.include_router(tasks.router)
app.include_router(participation.router)
app.include_router(storage.router)
app.include_router(notifications.router)
app.include_router(admin.router)


@app.get("/ping/", include_in_schema=False)
def ping():
    return {"ping": "pong"}

@app.get("/db/", include_in_schema=False)
def db_test():
    t1 = datetime.datetime.now()
    sql.select([1])
    t2 = datetime.datetime.now()
    return {"time": t2 - t1}


app = CORSMiddleware(
    app=app,
    allow_origins=[
        os.environ.get('ALLOW_ORIGIN'),
    ],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)
