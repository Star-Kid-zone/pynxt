from fastapi import FastAPI
from app.api.v1.routes import auth, notes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(notes.note_router, prefix="/api/v1/notes", tags=["Notes"])
