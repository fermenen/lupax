from fastapi import APIRouter
from .. import crud, schemas
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session
from ..dependencies import get_db

router = APIRouter()


@router.post('/tasks/', include_in_schema=False)
async def create_task(item: schemas.TaskCreate, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    return crud.create_task(db=db, item=item)


@router.get('/task/{task_id}/', response_model=schemas.Task, include_in_schema=False)
async def get_task(task_id: str, db: Session = Depends(get_db)):
    db_task = crud.get_task_public(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@router.post('/tasks/{task_id}/delete/', include_in_schema=False)
async def delete_task(task_id: str, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(
        db=db, user_id_supertokens=session.user_id)
    task = crud.get_task_public(db=db, task_id=task_id)
    if not crud.have_access_studie(db=db, studie_id=task.studie_id, user_id=user_lupax.id):
        raise HTTPException(status_code=403, detail="It's not your studie")
    crud.delete_task(db=db, task_id=task.id)
    taskBD = crud.get_studie(
        db=db, studie_id=task.studie_id, user_id=user_lupax.id).tasks
    for index, task in enumerate(sorted(taskBD, key=lambda t: t.index)):
        crud.change_index(db=db, task_id=task.id, new_index=index)
    return {'true'}


@router.post('/tasks/{task_id}/edit/', include_in_schema=False)
async def edit_description_task(task_id: str, item: schemas.TaskEditDescription, db: Session = Depends(get_db), session: SessionContainer = Depends(verify_session())):
    user_lupax = crud.get_user_of_supertokens(
        db=db, user_id_supertokens=session.user_id)
    task = crud.get_task_public(db=db, task_id=task_id)
    if not crud.have_access_studie(db=db, studie_id=task.studie_id, user_id=user_lupax.id):
        raise HTTPException(status_code=403, detail="It's not your studie")
    crud.edit_task_description(db=db, task_id=task_id, item=item)
    return {'true'}
