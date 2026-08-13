from pydantic import BaseModel
from typing import List, Optional
from app.schemas.orders import OrderResponse

class TableOverview(BaseModel):
    table_number: str
    is_occupied: bool
    active_order_count: int
    total_unpaid_amount: int
    needs_bill: Optional[bool] = False

class TableDetailResponse(BaseModel):
    table_number: str
    is_occupied: bool
    orders: List[OrderResponse]
    total_bill: int
