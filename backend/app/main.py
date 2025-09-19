# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers from app/routers directory
from app.routers import auth_routes, admin_routes, report_routes, user_routes

app = FastAPI(title="CivicFix API")

origins = [
    "http://localhost:3000",   
    "http://127.0.0.1:3000",
    "http://localhost:5173",   
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(report_routes.router, prefix="/reports", tags=["reports"])
app.include_router(admin_routes.router, prefix="/admin", tags=["admin"])
