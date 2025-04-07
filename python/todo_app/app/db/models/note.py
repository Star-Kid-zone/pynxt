from pydantic import BaseModel
from uuid import UUID, uuid4
from datetime import datetime

class Note(BaseModel):
    note_id: UUID = uuid4()
    note_title: str
    note_content: str
    last_update: datetime = datetime.utcnow()
    created_on: datetime = datetime.utcnow()
