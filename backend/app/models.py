# models.py - Pydantic models
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: str = "citizen"
    city: Optional[str] = None  # <-- only required if role is authority


class UserOut(BaseModel):
    id: str
    full_name: str
    phone: str
    email: Optional[str]
    role: str

# class Token(BaseModel):
#     access_token: str
#     token_type: str = "bearer"
#     role : str

class ReportCreate(BaseModel):
    title: str
    description: str
    category: str
    location: Optional[dict] = None # {lat: float, lng: float, address: str}
    image_base64: Optional[str] = None
    urgency: Optional[str] = "medium"

class ReportOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    location: dict
    status: str
    created_at: datetime
    reporter_id: str
