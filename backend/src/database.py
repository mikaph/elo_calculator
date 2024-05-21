from dotenv import load_dotenv
from sqlalchemy import create_engine, String, Column, Integer, Boolean, text
from sqlalchemy.orm import declarative_base, sessionmaker
import os

load_dotenv(".env")

ENV = os.environ.get("PYTHON_ENV", "development")


if ENV == "production":
    DATABASE_URL = "mysql+pymysql://root:root@db:3306/elo_calculator_db"
else:
    DATABASE_URL = "mysql+pymysql://root:root@db:3306/elo_calculator_db"

base_url = "/".join(DATABASE_URL.split("/")[:-1])
temp_engine = create_engine(base_url)
database_name = DATABASE_URL.split("/")[-1]
with temp_engine.connect() as conn:
    conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {database_name};"))
temp_engine.dispose()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()
Base = declarative_base()


class Players(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True)
    sport = Column(String(30))
    name = Column(String(30))


class RecentGames(Base):
    __tablename__ = "recent_games"

    id = Column(Integer, primary_key=True)
    sport = Column(String(30))
    winner = Column(String(30))
    loser = Column(String(30))
    time = Column(String(30))
    submitter = Column(String(30))
    elochange_winner = Column(Integer)
    elochange_loser = Column(Integer)


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(30), unique=True)
    hashed_password = Column(String(90))
    is_admin = Column(Boolean, default=False)


class Statistics(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True)
    sport = Column(String(30))
    name = Column(String(30))
    elo = Column(Integer)
    wins = Column(Integer)
    losses = Column(Integer)
    last10 = Column(String(10))


class Sports(Base):
    __tablename__ = "sports"

    id = Column(Integer, primary_key=True)
    name = Column(String(30), unique=True)
