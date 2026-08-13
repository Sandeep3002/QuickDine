import motor.motor_asyncio
import logging
from app.config import settings

logger = logging.getLogger("quickdine.database")

class DatabaseManager:
    def __init__(self):
        self.client: motor.motor_asyncio.AsyncIOMotorClient = None
        self.db = None
        self.use_memory_db: bool = False
        # In-memory storage structures for fallback mode
        self.memory_orders: list[dict] = []
        self.memory_menu: list[dict] = []

    async def connect_to_storage(self):
        """Attempts to connect to MongoDB; falls back gracefully to in‑memory store."""
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGO_URL,
                serverSelectionTimeoutMS=settings.MONGO_TIMEOUT_MS
            )
            await self.client.server_info()
            self.db = self.client[settings.DB_NAME]
            self.use_memory_db = False
            logger.info("Connected to MongoDB successfully!")
        except Exception as e:
            logger.warning(f"MongoDB connection failed ({e}). Operating in resilient In‑Memory Database mode.")
            self.use_memory_db = True

    async def close_connection(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB client connection closed.")

    @property
    def orders_collection(self):
        if not self.use_memory_db and self.db is not None:
            return self.db.get_collection("orders")
        return None

    @property
    def menu_collection(self):
        if not self.use_memory_db and self.db is not None:
            return self.db.get_collection("menu")
        return None

db_manager = DatabaseManager()
