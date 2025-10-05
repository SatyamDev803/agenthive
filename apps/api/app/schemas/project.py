from pydantic import BaseModel

class ProjectIn(BaseModel):
    name: str
    description: str | None = None

class ProjectOut(ProjectIn):
    id: int
    owner_id: int
