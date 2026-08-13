from pydantic import BaseModel, Field
from typing import Optional

class MenuItemBase(BaseModel):
    title: str = Field(..., description="Title of the dish")
    desc: str = Field(..., description="Description of ingredients/flavor profile")
    price: str = Field(..., description="Price e.g. ₹340")
    category: str = Field(..., description="Category: indian, chinese, western")
    img: str = Field(..., description="Image URL or relative path")
    is_available: bool = Field(True, description="Item availability status")

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemResponse(MenuItemBase):
    id: str
