from datetime import datetime,timezone
from fastapi import APIRouter, HTTPException, Request, Depends
from app.middleware.auth_middleware import get_current_user
from app.db.mongo import db
from uuid import uuid4
from app.utils.helpers import serialize_doc
from fastapi.responses import JSONResponse


note_router = APIRouter()

@note_router.post("/notes")
async def create_note(request: Request, user=Depends(get_current_user)):
    body = await request.json()
    note_title = body.get("note_title")
    note_content = body.get("note_content")

    # Validate input
    if not note_title or not note_content:
        return JSONResponse(
            status_code=400,
            content={
                "status": False,
                "status_code": 400,
                "message": "Title and Content are required.",
                "data": []
            }
        )

    now = datetime.now(timezone.utc)
    note = {
        "note_id": str(uuid4()),
        "note_title": note_title,
        "note_content": note_content,
        "last_update": now,
        "created_on": now,
        "user_id": user["_id"]
    }

    result = await db.notes.insert_one(note)

    inserted_note = {
        "_id": str(result.inserted_id),
        "note_id": note["note_id"],
        "note_title": note["note_title"],
        "note_content": note["note_content"],
        "last_update": note["last_update"],
        "created_on": note["created_on"],
        "user_id": str(note["user_id"])
    }

    return {
        "status": True,
        "status_code": 200,
        "message": "Note created successfully",
        "data": [inserted_note]
    }

@note_router.get("/notes")
async def list_notes(user=Depends(get_current_user)):
    user_id = user['_id']
    print(user_id)
    notes = await db.notes.find({"user_id": user_id}).to_list(100)
    serialized_notes = [serialize_doc(note) for note in notes]
    
    return {
        "status": True,
        "status_code": 200,
        "message": "Notes fetched",
        "data": serialized_notes
    }


@note_router.put("/notes/{note_id}")
async def update_note(note_id: str, request: Request, user=Depends(get_current_user)):
    body = await request.json()
    
    update_data = {
        key: body[key] for key in ("note_title", "note_content") if key in body
    }

    if not update_data:
        return JSONResponse(
            status_code=400,
            content={
                "status": False,
                "status_code": 400,
                "message": "No fields to update.",
                "data": []
            }
        )

    update_data["last_update"] = datetime.now(timezone.utc)

    result = await db.notes.update_one(
        {"note_id": note_id, "user_id": user["_id"]},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return JSONResponse(
            status_code=404,
            content={
                "status": False,
                "status_code": 404,
                "message": "Note not found or unauthorized.",
                "data": []
            }
        )

    # Fetch the updated note
    updated_note = await db.notes.find_one({"note_id": note_id, "user_id": user["_id"]})

    # Optional: convert ObjectId to string or serialize as needed
    if updated_note and "_id" in updated_note:
        updated_note["_id"] = str(updated_note["_id"])

    return {
        "status": True,
        "status_code": 200,
        "message": "Note updated successfully",
        "data": [updated_note]  # returning in array as requested
    }


@note_router.delete("/notes/{note_id}")
async def delete_note(note_id: str, user=Depends(get_current_user)):
    result = await db.notes.delete_one({
        "note_id": note_id,
        "user_id": user["_id"]
    })

    if result.deleted_count == 0:
        return JSONResponse(
            status_code=404,
            content={
                "status": False,
                "status_code": 404,
                "message": "Note not found or unauthorized.",
                "data": []
            }
        )

    return {
        "status": True,
        "status_code": 200,
        "message": "Note deleted successfully",
        "data": []
    }
