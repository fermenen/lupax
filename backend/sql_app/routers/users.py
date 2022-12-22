from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.thirdpartyemailpassword.syncio import get_user_by_id, emailpassword_sign_in, update_email_or_password
from supertokens_python.recipe.thirdpartyemailpassword.interfaces import EmailPasswordSignInWrongCredentialsError
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


@router.delete("/delete_account/", include_in_schema=False)
def delete_account(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    return crud.delete_account(db, supertokens_user_id=session.user_id)


@router.post("/change_password/", include_in_schema=False)
def change_password(item: schemas.PasswordChange, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_id = session.user_id
    users_info = get_user_by_id(user_id)

    if users_info is None:
        raise Exception("Should never come here")

    isPasswordValid = emailpassword_sign_in(
        users_info.email, item.old_password)

    if isinstance(isPasswordValid, EmailPasswordSignInWrongCredentialsError):
        # TODO: handle incorrect password error
        return

    return update_email_or_password(user_id, password=item.new_password)
