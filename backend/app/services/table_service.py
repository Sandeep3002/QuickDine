from typing import List
from app.services.order_service import order_service
from app.schemas.tables import TableOverview, TableDetailResponse

class TableService:
    async def get_tables_overview(self, total_tables: int = 10) -> List[TableOverview]:
        all_orders = await order_service.get_orders()
        overview = []

        for t in range(1, total_tables + 1):
            t_str = str(t)
            unpaid_orders = [
                o for o in all_orders 
                if str(o.get("table_number")) == t_str and o.get("status") not in ["paid", "cancelled"]
            ]
            
            active_orders = [
                o for o in unpaid_orders 
                if o.get("status") not in ["served", "bill_requested"]
            ]
            
            total_unpaid = sum(o.get("total_amount", 0) for o in unpaid_orders)
            is_occupied = len(unpaid_orders) > 0
            needs_bill = any(o.get("status") == "bill_requested" for o in unpaid_orders)

            overview.append(
                TableOverview(
                    table_number=t_str,
                    is_occupied=is_occupied,
                    active_order_count=len(active_orders),
                    total_unpaid_amount=total_unpaid,
                    needs_bill=needs_bill
                )
            )

        return overview

    async def get_table_details(self, table_number: str) -> TableDetailResponse:
        orders = await order_service.get_orders(table_number=table_number)
        active_orders = [o for o in orders if o.get("status") not in ["paid", "cancelled"]]
        total_bill = sum(o.get("total_amount", 0) for o in active_orders)
        is_occupied = len(active_orders) > 0

        return TableDetailResponse(
            table_number=str(table_number),
            is_occupied=is_occupied,
            orders=orders,
            total_bill=total_bill
        )

table_service = TableService()
