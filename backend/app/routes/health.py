from fastapi import APIRouter
from app.database.database import db_manager
from app.services.order_service import order_service

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
@router.get("/")
async def health_check():
    """System status and database connection diagnostics."""
    all_orders = await order_service.get_orders()
    active_orders = [o for o in all_orders if o.get("status") not in ["paid", "served", "cancelled"]]
    
    return {
        "status": "online",
        "database_mode": "in_memory_fallback" if db_manager.use_memory_db else "mongodb_connected",
        "total_orders_tracked": len(all_orders),
        "active_kitchen_orders": len(active_orders)
    }
