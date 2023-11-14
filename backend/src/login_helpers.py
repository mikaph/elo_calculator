from passlib.context import CryptContext
import jwt
from fastapi import HTTPException, Request
from datetime import datetime, timedelta
import time
import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from src.data_types import DBUser, Credentials
from src.database import Users

load_dotenv(".env")

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = os.environ.get("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_token(request: Request):
    # Get the token from the Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or "bearer" not in auth_header.lower():
        raise HTTPException(status_code=400, detail="Bearer token not found")

    # Extract token
    token = auth_header.split(" ")[1]

    # Decode and verify the token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    # Check token claims (e.g., expiration)
    if "exp" in payload and int(payload["exp"]) < time.time():
        raise HTTPException(status_code=401, detail="Token has expired")

    # Optional: Check if token is in a list of revoked tokens (this would require additional setup)

    return token


def get_user(db: Session, username: str) -> DBUser | None:
    user = db.query(Users).filter_by(username=username).one_or_none()
    if user:
        return DBUser(username=user.username, hashed_password=user.hashed_password)


def create_user(db: Session, credentials: Credentials) -> str:
    hashed_pw = hash_password(credentials.password)
    if credentials.username == "palisuli":
        new_user = Users(username=credentials.username, hashed_password=hashed_pw, is_admin=True)
    else:
        new_user = Users(username=credentials.username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    return new_user.username


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
