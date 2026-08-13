from fastapi import APIRouter
from typing import List
from app.schemas.tables import TableOverview, TableDetailResponse
from app.services.table_service import table_service

router = APIRouter(prefix="/api/tables", tags=["Tables"])

@router.get("", response_model=List[TableOverview])
@router.get("/", response_model=List[TableOverview])
async def get_tables_overview():
    """Returns real-time status, occupancy, and active order counts for all restaurant tables."""
    return await table_service.get_tables_overview()

@router.get("/{table_number}", response_model=TableDetailResponse)
async def get_table_detail(table_number: str):
    """Returns active order details and accumulated bill for a specific table."""
    return await table_service.get_table_details(table_number)
