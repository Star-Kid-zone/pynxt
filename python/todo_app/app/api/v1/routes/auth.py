from fastapi import APIRouter, HTTPException, status
from app.db.mongo import db
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.core.config import settings  
from app.db.models.user import User ,UserLogin
from uuid import uuid4
from fastapi.responses import JSONResponse

auth_router = APIRouter()


@auth_router.post("/register")
async def register_user(user: User):
    user_dict = user.dict()  
    user_dict['user_id'] = str(uuid4()) 
    user_dict['password'] = hash_password(user_dict['password'])  

    existing_user = await db.users.find_one({"user_email": user.user_email})
    if existing_user:
        return JSONResponse(
            status_code=400,
            content={
                "status": False,
                "status_code": 400,
                "message": "Email already registered",
                "data": []
            }
        )

    await db.users.insert_one(user_dict)
    return {
        "status": True,
        "status_code": 200,
        "message": "User registered",
        "data": []
    }



@auth_router.post("/login")
async def login_user(user: UserLogin):
    db_user = await db.users.find_one({"user_email": user.user_email})
    
    if not db_user or not verify_password(user.password, db_user['password']):
        return JSONResponse(
            status_code=400,
            content={
                "status": False,
                "status_code": 400,
                "message": "Invalid credentials",
                "data": []
            }
        )
    
    token = create_access_token({
        "user_id": db_user['user_id'],
        "_id": str(db_user['_id']),
        "name": db_user['user_name'],
        "email": db_user['user_email']
    }, settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    return {
        "status": True,
        "status_code": 200,
        "message": "Login successful",
        "data": {
            "token": token
        }
    }

