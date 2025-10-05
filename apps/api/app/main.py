from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .routers import auth as auth_router
from .routers import users as users_router
from .routers import projects as projects_router
from .routers import tasks as tasks_router

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router.router, prefix="/api/users", tags=["users"])
app.include_router(projects_router.router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks_router.router, prefix="/api/tasks", tags=["tasks"])
