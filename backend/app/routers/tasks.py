from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=List[schemas.TaskOut])
def list_tasks(
    status_filter: str = Query("all", alias="status", regex="^(all|completed|pending)$"),
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|due_date|priority|title)$"),
    sort_dir: str = Query("desc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    return crud.get_tasks(
        db,
        status=status_filter,
        category=category,
        search=search,
        sort_by=sort_by,
        sort_dir=sort_dir,
    )


@router.get("/stats", response_model=schemas.TaskStats)
def task_stats(db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db)
    total = len(tasks)
    completed = len([task for task in tasks if task.completed])
    pending = total - completed
    completion_rate = (completed / total) if total else 0.0
    return schemas.TaskStats(
        total=total,
        completed=completed,
        pending=pending,
        completion_rate=completion_rate,
    )


@router.get("/{task_id}", response_model=schemas.TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, task)


@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(
    task_id: int,
    task_update: schemas.TaskUpdate,
    db: Session = Depends(get_db),
):
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.update_task(db, db_task, task_update)


@router.patch("/{task_id}/toggle", response_model=schemas.TaskOut)
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return crud.toggle_task(db, db_task)


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    crud.delete_task(db, db_task)
    return {"message": "Task deleted"}
