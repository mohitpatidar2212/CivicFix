# report_routes.py
import re
from typing import Dict
from fastapi import APIRouter, HTTPException, Depends
from ..db import reports_col, users_col
from ..models import ReportCreate
from ..utils import get_current_user
from datetime import datetime
from bson import ObjectId
from fastapi import Query

router = APIRouter(prefix="/reports", tags=["reports"])

ALLOWED_MEDIA_TYPES = ["image/png", "image/jpeg", "image/jpg", "video/mp4"]

@router.post("/", response_model=dict)
async def create_report(r: ReportCreate, user=Depends(get_current_user)):
    if not r.title.strip() or not r.description.strip():
        raise HTTPException(400, "Title and description are required")

    doc = r.dict()
    doc["reporter_id"] = str(user.get("_id", user.get("id")))
    doc["status"] = "Submitted"
    doc["created_at"] = datetime.utcnow()

    # 🔑 Store city information
    if user.get("city"):
        doc["city"] = user["city"]

    # Handle media (image/video)
    if "image_base64" in doc and doc.get("image_base64"):
        media_type = doc.get("image_type", "image/png")
        if media_type not in ALLOWED_MEDIA_TYPES:
            raise HTTPException(400, f"Unsupported file type: {media_type}")

        doc["media"] = {
            "type": media_type,
            "data": doc["image_base64"],
        }

    # Cleanup
    doc.pop("image_base64", None)
    doc.pop("image_type", None)

    res = await reports_col.insert_one(doc)
    return {"success": True, "id": str(res.inserted_id)}


@router.get("/my", response_model=list)
async def my_reports(user=Depends(get_current_user)):
    cursor = reports_col.find(
        {"reporter_id": str(user.get("_id", user.get("id")))}
    ).sort("created_at", -1)

    out = []
    async for d in cursor:
        d["id"] = str(d["_id"])
        del d["_id"]

        # Don’t send full base64 back — just send info
        if "media" in d:
            d["has_media"] = True
            d["media_type"] = d["media"]["type"]
            del d["media"]

        out.append(d)
    return out

# @router.get("/{report_id}")
# async def get_report(report_id: str, user=Depends(get_current_user)):
#     try:
#         r = await reports_col.find_one({"_id": ObjectId(report_id)})
#     except:
#         raise HTTPException(400, "Invalid report id")

#     if not r:
#         raise HTTPException(404, "Report not found")

#     r["id"] = str(r["_id"])
#     del r["_id"]

#     # ⚠️ Return media info separately
#     if "media" in r:
#         r["media_preview"] = {
#             "type": r["media"]["type"],
#             "length": len(r["media"]["data"]),
#         }
#         # If needed, you could add a dedicated `/reports/{id}/media` route to fetch raw media
#         # For now, we don’t send the whole base64 to avoid large payloads

#     return r


@router.get("/analytics", response_model=dict)
async def reports_analytics(user=Depends(get_current_user)):
    """
    Return analytics data for the logged-in user (citizen/authority).
    Citizens see only their own reports.
    Authorities see reports from their city.
    """

    role = user.get("role", "").lower()
    match_stage = {}

    # 1️⃣ Citizens: filter by reporter_id
    if role == "citizen":
        print("User is a citizen")
        reporter_id = str(user.get("_id"))  # stored as string in DB
        match_stage["reporter_id"] = reporter_id

    # 2️⃣ Authorities: filter by city (nested field)
    elif role in ("authority", "governmentofficial"):
        user_city = user.get("city") or (user.get("location") or {}).get("address")
        if user_city:
            # Case-insensitive match for city
            match_stage["location.address"] = re.compile(f"^{re.escape(user_city)}$", re.IGNORECASE)

    print(match_stage)
    # 3️⃣ Status distribution
    status_pipeline = [{"$match": match_stage}] if match_stage else []
    status_pipeline.append({"$group": {"_id": "$status", "count": {"$sum": 1}}})
    status_cursor = reports_col.aggregate(status_pipeline)
    status_data: Dict[str, int] = {}
    async for doc in status_cursor:
        status_data[doc["_id"]] = doc["count"]

    print(status_pipeline)
    print(status_cursor)
    print(status_data)
    # 4️⃣ Monthly complaints (YYYY-MM)
    month_pipeline = [{"$match": match_stage}] if match_stage else []
    month_pipeline.extend([
        {"$group": {"_id": {"$dateToString": {"format": "%Y-%m", "date": "$created_at"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ])
    month_cursor = reports_col.aggregate(month_pipeline)
    monthly_data = []
    async for doc in month_cursor:
        monthly_data.append({"month": doc["_id"], "complaints": doc["count"]})

    # 5️⃣ Complaints by category (authorities only)
    category_data = None
    if role in ("authority", "governmentofficial"):
        category_pipeline = [{"$match": match_stage}] if match_stage else []
        category_pipeline.append({"$group": {"_id": "$category", "count": {"$sum": 1}}})
        category_pipeline.append({"$sort": {"count": -1}})
        category_cursor = reports_col.aggregate(category_pipeline)
        category_data = {}
        async for doc in category_cursor:
            category_data[doc["_id"]] = doc["count"]
    
    # 6️⃣ Return results
    return {
        "status_data": status_data,          # e.g., {"Solved": 2, "Pending": 1}
        "monthly_data": monthly_data,        # e.g., [{"month": "2025-09", "complaints": 3}]
        "category_data": category_data,      # e.g., {"Road": 2, "Water": 1} or None for citizens
    }


# ------------------------
# Fetch complaints (pending/in-progress)
# ------------------------
@router.get("/official/complaints", response_model=list)
async def get_complaints(user=Depends(get_current_user)):
    """
    Fetch all complaints for a government official's city that are not resolved/solved.
    Citizens cannot access this.
    """
    role = user.get("role", "").lower()
    if role not in ("authority", "governmentofficial"):
        raise HTTPException(status_code=403, detail="Not authorized")

    user_city = user.get("city") or (user.get("location") or {}).get("address")
    if not user_city:
        raise HTTPException(status_code=400, detail="City information missing")

    match_stage = {
        "location.address": re.compile(f"^{re.escape(user_city)}$", re.IGNORECASE),
        "status": {"$nin": ["Resolved", "Solved"]},
    }

    complaints = []
    cursor = reports_col.find(match_stage).sort("created_at", -1)

    async for d in cursor:
        d["id"] = str(d["_id"])
        del d["_id"]

        # Add media info if available
        if "media" in d and d["media"]:
            media = d["media"]
            if "url" in media:
                d["media_url"] = media["url"]
            elif "data" in media and "type" in media:
                d["media_url"] = f"data:{media['type']};base64,{media['data']}"
            else:
                d["media_url"] = None
            d["media_type"] = media.get("type")
            del d["media"]
        else:
            d["media_url"] = None
            d["media_type"] = None

        # Fetch reporter/citizen name
        reporter_id = d.get("reporter_id")
        if reporter_id:
            reporter = await users_col.find_one({"_id": ObjectId(reporter_id)})
            d["reporter_name"] = reporter.get("name") if reporter else "Citizen"
        else:
            d["reporter_name"] = "Citizen"

        complaints.append(d)
    return complaints

# ------------------------
# Fetch resolved cases
# ------------------------
@router.get("/official/resolved", response_model=list)
async def get_resolved_cases(user=Depends(get_current_user)):
    """
    Fetch all resolved/solved complaints for a government official's city.
    """
    role = user.get("role", "").lower()
    if role not in ("authority", "governmentofficial"):
        raise HTTPException(status_code=403, detail="Not authorized")

    user_city = user.get("city") or (user.get("location") or {}).get("address")
    if not user_city:
        raise HTTPException(status_code=400, detail="City information missing")

    match_stage = {
        "location.address": re.compile(f"^{re.escape(user_city)}$", re.IGNORECASE),
        "status": {"$in": ["Resolved", "Solved"]},  # Include both
    }

    resolved = []
    cursor = reports_col.find(match_stage).sort("created_at", -1)
    async for d in cursor:
        d["id"] = str(d["_id"])
        del d["_id"]

        if "media" in d:
            d["has_media"] = True
            d["media_type"] = d["media"]["type"]
            del d["media"]

        resolved.append(d)
    print(resolved)
    return resolved

# ------------------------
# Mark complaint as resolved
# ------------------------
@router.patch("/{report_id}/resolve", response_model=dict)
async def resolve_complaint(report_id: str, user=Depends(get_current_user)):
    """
    Mark a complaint as resolved.
    Only government officials/authorities can perform this action.
    """
    role = user.get("role", "").lower()
    if role not in ("authority", "governmentofficial"):
        raise HTTPException(status_code=403, detail="Not authorized")

    try:
        obj_id = ObjectId(report_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid report id")

    report = await reports_col.find_one({"_id": obj_id})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    await reports_col.update_one(
        {"_id": obj_id},
        {"$set": {"status": "Resolved", "updated_at": datetime.utcnow()}}
    )

    return {"success": True, "message": "Complaint marked as resolved"}

