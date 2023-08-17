from sqlalchemy import create_engine, String, Column, Integer
from sqlalchemy.orm import declarative_base, sessionmaker
import os


ENV = os.environ.get("PYTHON_ENV", "development")


if ENV == "production":
    DATABASE_URL = "mysql+pymysql://root:root@db:3306/elo_calculator_db"
else:
    DATABASE_URL = "sqlite:///db.sqlite"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()
Base = declarative_base()


class Players(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True)
    sport = Column(String(30))
    name = Column(String(30))

    def save(self):
        session.add(self)
        session.commit()


class RecentGames(Base):
    __tablename__ = "recent_games"

    id = Column(Integer, primary_key=True)
    sport = Column(String(30))
    winner = Column(String(30))
    loser = Column(String(30))
    time = Column(String(30))

    def save(self):
        session.add(self)
        session.commit()


class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(30))
    hashed_password = Column(String(90))

    def save(self):
        session.add(self)
        session.commit()


class Statistics(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True)
    sport = Column(String(30))
    name = Column(String(30))
    elo = Column(Integer)
    wins = Column(Integer)
    losses = Column(Integer)
    last10 = Column(String(10))

    def save(self):
        session.add(self)
        session.commit()


class Sports(Base):
    __tablename__ = "sports"

    id = Column(Integer, primary_key=True)
    name = Column(String(30))

    def save(self):
        session.add(self)
        session.commit()
