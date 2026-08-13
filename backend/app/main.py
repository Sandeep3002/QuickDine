from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import db_manager
from app.services.menu_service import menu_service
from app.routes.orders import router as orders_router
from app.routes.menu import router as menu_router
from app.routes.tables import router as tables_router
from app.routes.health import router as health_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    await db_manager.connect_to_storage()
    await menu_service.seed_initial_menu()
    yield
    # Shutdown logic
    await db_manager.close_connection()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade Backend API for QuickDine QR Code Dining & Table Ordering System",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(orders_router)
app.include_router(menu_router)
app.include_router(tables_router)
app.include_router(health_router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "database_mode": "in_memory_fallback" if db_manager.use_memory_db else "mongodb_connected",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc"
        },
        "endpoints": {
            "orders": "/api/orders",
            "menu": "/api/menu",
            "tables": "/api/tables",
            "health": "/api/health"
        }
    }
