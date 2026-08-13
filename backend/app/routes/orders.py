from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from app.schemas.orders import (
    OrderCreate, 
    OrderResponse, 
    OrderStatus, 
    OrderStatusUpdate
)
from app.services.order_service import order_service

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.post("", response_model=OrderResponse, status_code=201)
@router.post("/", response_model=OrderResponse, status_code=201)
async def create_order(order: OrderCreate):
    """Creates a new table order."""
    created = await order_service.create_order(order)
    return created

@router.get("", response_model=List[OrderResponse])
@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    table_number: Optional[str] = Query(None, description="Filter orders by table number"),
    status: Optional[str] = Query(None, description="Filter orders by status")
):
    """Retrieves all orders with optional table or status filtering."""
    return await order_service.get_orders(table_number=table_number, status=status)

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(order_id: str):
    """Retrieves a single order by its ID."""
    order = await order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: Optional[str] = Query(None, description="Status passed via query param"),
    body: Optional[OrderStatusUpdate] = None
):
    """
    Updates the status of an order.
    Supports status passed via query parameter (e.g. ?status=served) or JSON body.
    """
    target_status = status or (body.status.value if body else None)
    
    if not target_status:
        raise HTTPException(status_code=400, detail="Status parameter missing")

    valid_statuses = [s.value for s in OrderStatus]
    if target_status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status '{target_status}'. Must be one of {valid_statuses}"
        )

    updated_order = await order_service.update_order_status(order_id, target_status)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")

    return updated_order

@router.delete("/{order_id}")
async def delete_order(order_id: str):
    """Cancels/deletes an order."""
    success = await order_service.delete_order(order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": f"Order {order_id} deleted successfully"}
