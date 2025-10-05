from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.db import get_db
from ..models.task import Task
from ..schemas.task import TaskIn, TaskOut
from ..deps.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=list[TaskOut])
async def list_tasks(project_id: int | None = None, db: AsyncSession = Depends(get_db), uid: str = Depends(get_current_user)):
    stmt = select(Task).order_by(Task.updated_at.desc())
    if project_id:
        stmt = stmt.where(Task.project_id == project_id)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.post("/", response_model=TaskOut)
async def create_task(payload: TaskIn, db: AsyncSession = Depends(get_db), uid: str = Depends(get_current_user)):
    t = Task(**payload.dict())
    db.add(t)
    await db.commit()
    await db.refresh(t)
    return t
