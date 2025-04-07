from fastapi import Request, HTTPException, status, Depends
from jose import JWTError, jwt
from app.core.config import settings  

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {
            "user_id": payload.get("user_id"),
            "_id": payload.get("_id"),
            "user_name": payload.get("user_name"),
            "email": payload.get("email")
        }
    except (JWTError, IndexError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
