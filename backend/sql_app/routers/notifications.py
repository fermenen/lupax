from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from ..dependencies import get_db
from ..services import crud
from ..schemas import schemas

router = APIRouter()


@router.get("/notifications/", response_model=List[schemas.Notifications], include_in_schema=False)
def get_all_notifications(db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    return crud.get_notifications(db, user_lupax.id)


@router.post("/notifications/{notification_id}/see/", include_in_schema=False)
def edit_notification_seen(notification_id: str,  db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(db, session.user_id)
    db_notification = crud.get_notification(db=db, notification_id=notification_id, user_id=user_lupax.id)
    if db_notification is None:
         raise HTTPException(status_code=404, detail="Notification not found")
    crud.mark_as_viewed(db=db, notification_id=db_notification.id)
    return True