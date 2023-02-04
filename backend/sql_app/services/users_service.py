import nest_asyncio
from retry import retry
from sqlalchemy.orm import Session
from supertokens_python.syncio import delete_user
from supertokens_python.recipe.session.syncio import revoke_all_sessions_for_user
from psycopg2 import OperationalError
from .notifications_service import add_notification
from ..schemas import schemas
from ..models import models
from ..config.database import SessionLocal


def get_user_of_supertokens(db: Session, user_id_supertokens: int):
    return db.query(models.Users).filter(models.Users.id_supertokens == user_id_supertokens).first()


def get_user_info(db: Session, user_id_lupax: int):
    return db.query(models.Users).filter(models.Users.id == user_id_lupax).first()


def get_user_by_mail(db: Session, user_email: str):
    return db.query(models.Users).filter(models.Users.email == user_email).first()


@retry(OperationalError, delay=2, tries=5)
def create_user(user_supertokens: object, name: str, last_name: str, picture: str = ""):
    try:
        session = SessionLocal()
        db_preferences = models.Preferences()
        session.add(db_preferences)
        session.commit()
        db_user = models.Users(id_supertokens=user_supertokens.user_id, email=user_supertokens.email,
                               name=name, last_name=last_name, picture=picture, preferences_id=db_preferences.id)
        session.add(db_user)
        session.commit()
        add_notification(db=session, type='app', user_id=db_user.id,
                         text="Welcome to lupax {}. Your account has been successfully created. If you have any questions, please contact us in the support tab.".format(db_user.name))
        session.commit()
        session.refresh(db_user)
        session.refresh(db_preferences)
    except Exception as error:
        session.rollback()
        nest_asyncio.apply()
        delete_user_in_supertokens(
            supertokens_user_id=user_supertokens.user_id)
        raise error
    finally:
        session.close()


def edit_preferences(db: Session, item: schemas.PreferencesEdit, user_id: int):
    db_user_me = get_user_info(db=db, user_id_lupax=user_id)
    item_changes = {
        key: value for key, value in item.dict().items() if value is not None
    }
    db.query(models.Preferences).filter_by(
        id=db_user_me.preferences_id).update(item_changes)
    db.commit()


def delete_account(db: Session, supertokens_user_id: int):
    try:
        user_lupax = get_user_of_supertokens(db, supertokens_user_id)
        db.query(models.Notifications).filter(
            models.Notifications.user_id == user_lupax.id).delete()
        db.query(models.Users).filter(
            models.Users.id_supertokens == supertokens_user_id).delete()
    except Exception as err:
        db.rollback()
        raise err
    else:
        db.commit()
        revoke_all_sessions_for_user(supertokens_user_id)
        delete_user_in_supertokens(supertokens_user_id)


def delete_user_in_supertokens(supertokens_user_id: int):
    delete_user(supertokens_user_id)
