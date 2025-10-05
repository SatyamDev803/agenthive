from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from ..core.db import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str | None]
    password_hash: Mapped[str]
