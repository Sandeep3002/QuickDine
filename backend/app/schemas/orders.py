from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY_FOR_WAITER = "ready_for_waiter"
    SERVED = "served"
    BILL_REQUESTED = "bill_requested"
    PAID = "paid"
    CANCELLED = "cancelled"

class OrderItem(BaseModel):
    title: str = Field(..., description="Name of the menu dish")
    price: str = Field(..., description="Price string e.g. ₹340")
    quantity: int = Field(..., ge=1, description="Quantity ordered")
    note: Optional[str] = Field(None, description="Special instructions / notes for this food item")

class OrderCreate(BaseModel):
    table_number: str = Field(..., description="Table number placing the order")
    items: List[OrderItem] = Field(..., min_length=1, description="List of ordered items")
    total_amount: int = Field(..., ge=0, description="Total order price in INR")
    special_instructions: Optional[str] = Field(None, description="Optional kitchen notes")
    device_id: Optional[str] = Field(None, description="Unique identifier of the client device")

class OrderStatusUpdate(BaseModel):
    status: OrderStatus = Field(..., description="New order status")

class OrderResponse(BaseModel):
    id: str
    table_number: str
    items: List[OrderItem]
    total_amount: int
    status: OrderStatus
    created_at: str
    updated_at: Optional[str] = None
    special_instructions: Optional[str] = None
    device_id: Optional[str] = None
