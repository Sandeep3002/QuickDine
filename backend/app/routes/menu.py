from fastapi import APIRouter, Query
from typing import List, Optional
from app.schemas.menu import MenuItemCreate, MenuItemResponse
from app.services.menu_service import menu_service

router = APIRouter(prefix="/api/menu", tags=["Menu"])

@router.get("", response_model=List[MenuItemResponse])
@router.get("/", response_model=List[MenuItemResponse])
async def get_menu(category: Optional[str] = Query(None, description="Filter dishes by category")):
    """Returns the full restaurant menu or filtered by category."""
    return await menu_service.get_menu(category=category)

@router.get("/categories", response_model=List[str])
async def get_categories():
    """Returns all available dish categories."""
    return await menu_service.get_categories()

@router.post("", response_model=MenuItemResponse, status_code=201)
@router.post("/", response_model=MenuItemResponse, status_code=201)
async def add_menu_item(item: MenuItemCreate):
    """Adds a new dish to the QuickDine menu."""
    return await menu_service.add_menu_item(item)
