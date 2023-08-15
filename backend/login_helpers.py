from passlib.context import CryptContext
import jwt
from database import session, Users
import secrets
from fastapi import HTTPException, Request
from data_types import DBUser
from datetime import datetime, timedelta
import time


SECRET_KEY = secrets.SECRET_KEY
ALGORITHM = secrets.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = secrets.ACCESS_TOKEN_EXPIRE_MINUTES
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


def get_user(username: str) -> DBUser | None:
    default_user = session.query(Users).filter_by(username=username).one_or_none()
    if default_user:
        return DBUser(username=default_user.username, hashed_password=default_user.hashed_password)


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
