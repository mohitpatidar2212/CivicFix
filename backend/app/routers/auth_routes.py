# auth_routes.py
from datetime import datetime
from fastapi import APIRouter, HTTPException
from ..db import users_col
from ..models import UserCreate
from ..auth import hash_password, verify_password, create_access_token
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["auth"])

from fastapi import HTTPException, Depends
from datetime import datetime

@router.post("/signup", response_model=dict)
async def signup(payload: UserCreate):
    print(payload)

    existing = await users_col.find_one({"phone": payload.phone})
    if existing:
        raise HTTPException(400, "Phone already registered")

    # If role is authority, ensure city is provided
    if payload.role == "authority" and not payload.city:
        raise HTTPException(400, "City is required for authority users")

    user_doc = payload.dict()

    if payload.password:
        user_doc["password"] = hash_password(payload.password)

    user_doc["created_at"] = datetime.utcnow()
    user_doc["role"] = payload.role

    res = await users_col.insert_one(user_doc)
    uid = str(res.inserted_id)

    token = create_access_token({"user_id": uid, "role": payload.role})

    return {"user_id": uid, "token": token}


@router.post("/login")
async def login(data: dict):
    # data: {phone/email, password}
    identifier = data.get("phone") or data.get("email")
    if not identifier:
        raise HTTPException(400, "provide phone or email")
    user = await users_col.find_one({"$or": [{"email": identifier}, {"phone": identifier}]},)
    if not user:
        raise HTTPException(400, "No user")
    if "password" not in user:
        raise HTTPException(400, "No password set for user")
    if not verify_password(data.get("password"), user["password"]):
        raise HTTPException(400, "Incorrect password")
    token = create_access_token({"user_id": str(user["_id"]), "role": user.get("role","citizen")})
    if user and "_id" in user:
        user["_id"] = str(user["_id"])

    return {"access_token": token, "user": user}
