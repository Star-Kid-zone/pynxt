from bson import ObjectId

def serialize_doc(doc):
    """Convert MongoDB document's ObjectId fields to string"""
    doc["_id"] = str(doc["_id"])
    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    return doc
