from sqlalchemy import create_engine, String, MetaData
from sqlalchemy.orm import DeclarativeBase, mapped_column, sessionmaker, Mapped
import os


ENV = os.environ.get("PYTHON_ENV", "development")


if ENV == "production":
    DATABASE_URL = "postgresql://root:root@db_container_name/db_name"
else:
    DATABASE_URL = "sqlite:///db.sqlite"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()


class Base(DeclarativeBase):
    def save(self):
        session.add(self)
        session.commit()


class Players(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True)
    sport: Mapped[str]  = mapped_column(String(30))
    name: Mapped[str] = mapped_column(String(30))


class RecentGames(Base):
    __tablename__ = "recent_games"

    id: Mapped[int]  = mapped_column(primary_key=True)
    winner: Mapped[str] = mapped_column(String(30))
    loser: Mapped[str] = mapped_column(String(30))
    time: Mapped[str] = mapped_column(String(30))


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int]  = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30))
    hashed_password: Mapped[str] = mapped_column(String(90))


class Statistics(Base):
    __tablename__ = "statistics"

    id: Mapped[int]  = mapped_column(primary_key=True)
    sport: Mapped[str] = mapped_column(String(30))
    name: Mapped[str] = mapped_column(String(30))
    elo: Mapped[int] 
    wind: Mapped[int] 
    losses: Mapped[int] 
    last10: Mapped[str] = mapped_column(String(10))


class Sports(Base):
    __tablename__ = "sports"

    id: Mapped[int]  = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
