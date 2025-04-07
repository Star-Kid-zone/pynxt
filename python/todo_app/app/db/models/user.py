from pydantic import BaseModel, EmailStr
from uuid import UUID, uuid4
from datetime import datetime

class User(BaseModel):
    user_id: UUID = uuid4()
    user_name: str
    user_email: EmailStr
    password: str
    last_update: datetime = datetime.utcnow()
    create_on: datetime = datetime.utcnow()
    
class UserLogin(BaseModel):
    user_email: EmailStr
    password: str
