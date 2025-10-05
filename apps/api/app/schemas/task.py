from pydantic import BaseModel
from datetime import datetime

class TaskIn(BaseModel):
    project_id: int
    title: str
    status: str = "todo"
    due_date: datetime | None = None

class TaskOut(TaskIn):
    id: int
    assignee_id: int | None = None
    created_at: datetime
    updated_at: datetime
