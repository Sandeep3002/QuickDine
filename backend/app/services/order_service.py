from typing import List, Optional
import datetime
import uuid
from app.database.database import db_manager
from app.schemas.orders import OrderCreate, OrderStatus


class OrderService:
    async def create_order(self, order_in: OrderCreate) -> dict:
        """Create a new order.
        Each POST from a device creates a separate order for the table.
        The owner/kitchen dashboard aggregates all orders per table.
        """
        order_id = "QD-" + str(uuid.uuid4().hex[:6]).upper()
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        new_order = {
            "id": order_id,
            "table_number": str(order_in.table_number),
            "items": [item.dict() for item in order_in.items],
            "total_amount": order_in.total_amount,
            "status": OrderStatus.PENDING.value,
            "special_instructions": order_in.special_instructions,
            "created_at": now,
            "updated_at": now,
            "device_id": order_in.device_id,
        }

        if db_manager.use_memory_db:
            db_manager.memory_orders.append(new_order)
        else:
            col = db_manager.orders_collection
            await col.insert_one(new_order.copy())

        return new_order

    async def get_orders(
        self,
        table_number: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[dict]:
        if db_manager.use_memory_db:
            orders = list(db_manager.memory_orders)
            if table_number:
                orders = [o for o in orders if str(o.get("table_number")) == str(table_number)]
            if status:
                orders = [o for o in orders if o.get("status") == status]
            return sorted(orders, key=lambda x: x.get("created_at", ""), reverse=True)

        col = db_manager.orders_collection
        query = {}
        if table_number:
            query["table_number"] = str(table_number)
        if status:
            query["status"] = status

        cursor = col.find(query).sort("created_at", -1)
        orders = []
        async for doc in cursor:
            doc["_id"] = str(doc.get("_id"))
            orders.append(doc)
        return orders

    async def get_order_by_id(self, order_id: str) -> Optional[dict]:
        if db_manager.use_memory_db:
            for order in db_manager.memory_orders:
                if order.get("id") == order_id:
                    return order
            return None

        col = db_manager.orders_collection
        doc = await col.find_one({"id": order_id})
        if doc:
            doc["_id"] = str(doc.get("_id"))
            return doc
        return None

    async def update_order_status(self, order_id: str, status: str) -> Optional[dict]:
        """Update the status of an order (e.g. pending -> preparing -> served)."""
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()

        if db_manager.use_memory_db:
            for order in db_manager.memory_orders:
                if order.get("id") == order_id:
                    order["status"] = status
                    order["updated_at"] = now
                    return order
            return None

        col = db_manager.orders_collection
        result = await col.update_one(
            {"id": order_id},
            {"$set": {"status": status, "updated_at": now}},
        )
        if result.modified_count == 1:
            return await self.get_order_by_id(order_id)
        return None

    async def delete_order(self, order_id: str) -> bool:
        """Delete / cancel an order."""
        if db_manager.use_memory_db:
            before_count = len(db_manager.memory_orders)
            db_manager.memory_orders = [o for o in db_manager.memory_orders if o.get("id") != order_id]
            return len(db_manager.memory_orders) < before_count

        col = db_manager.orders_collection
        result = await col.delete_one({"id": order_id})
        return result.deleted_count > 0


order_service = OrderService()
