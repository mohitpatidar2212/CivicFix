# admin_routes.py
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from ..db import reports_col
from ..utils import get_current_user
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["admin"])

def admin_required(user):
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin access required")

@router.get("/reports")
async def all_reports(user=Depends(get_current_user), category: Optional[str] = None):
    admin_required(user)
    q = {}
    if category:
        q["category"] = category
    cursor = reports_col.find(q).sort("created_at",-1)
    out = []
    async for d in cursor:
        d["id"] = str(d["_id"])
        out.append(d)
    return out

@router.post("/reports/{report_id}/update")
async def update_report(report_id: str, payload: dict, user=Depends(get_current_user)):
    admin_required(user)
    upd = {}
    if "status" in payload:
        upd["status"] = payload["status"]
    if "assigned_to" in payload:
        upd["assigned_to"] = payload["assigned_to"]
    if "priority" in payload:
        upd["priority"] = payload["priority"]
    if not upd:
        raise HTTPException(400,"Nothing to update")
    upd["updated_at"] = datetime.utcnow()
    await reports_col.update_one({"_id": ObjectId(report_id)}, {"$set": upd})
    return {"ok": True}
