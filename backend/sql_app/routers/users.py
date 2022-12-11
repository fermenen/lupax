from fastapi import APIRouter
from fastapi import Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from ..dependencies import get_db
from .. import crud, schemas


router = APIRouter()


@router.get("/me/", response_model=schemas.User, include_in_schema=False)
def get_info_user(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session(session_required=False))):
    if session:
        return crud.get_user_of_supertokens(db, session.user_id)
    else:
        return {"role": "guest"}


@router.patch("/me/preferences/", include_in_schema=False)
def edit_preferences(item: schemas.PreferencesEdit, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    crud.edit_preferences(db=db, item=item, user_id=user_lupax.id)
    return True

# @router.get('/sessioninfo/', include_in_schema=False)
# async def get_session_info(session_: SessionContainer = Depends(verify_session())):
#     return JSONResponse({
#         'sessionHandle': session_.get_handle(),
#         'userId': session_.get_user_id(),
#         'accessTokenPayload': session_.get_access_token_payload(),
#         # 'sessionData': await session_.get_session_data()
#     })
