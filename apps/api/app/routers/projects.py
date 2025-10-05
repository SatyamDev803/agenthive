from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.db import get_db
from ..models.project import Project
from ..schemas.project import ProjectIn, ProjectOut
from ..deps.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=list[ProjectOut])
async def list_projects(db: AsyncSession = Depends(get_db), uid: str = Depends(get_current_user)):
    res = await db.execute(select(Project))
    return res.scalars().all()

@router.post("/", response_model=ProjectOut)
async def create_project(payload: ProjectIn, db: AsyncSession = Depends(get_db), uid: str = Depends(get_current_user)):
    proj = Project(name=payload.name, description=payload.description, owner_id=int(uid))
    db.add(proj)
    await db.commit()
    await db.refresh(proj)
    return proj
