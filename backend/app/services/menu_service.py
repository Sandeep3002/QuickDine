from typing import List, Optional
import uuid
from app.database.database import db_manager
from app.schemas.menu import MenuItemCreate

INITIAL_MENU = [
    # Indian
    {
        "id": "menu-1",
        "title": "Butter Chicken & Garlic Naan",
        "desc": "Tender chicken simmered in a rich, buttery tomato-cream gravy served with hot garlic naan.",
        "price": "₹340",
        "category": "indian",
        "img": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-2",
        "title": "Hyderabadi Chicken Biryani",
        "desc": "Fragrant basmati rice layered with spiced marinated chicken, saffron, fried onions, and fresh mint.",
        "price": "₹360",
        "category": "indian",
        "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-3",
        "title": "Paneer Tikka Masala",
        "desc": "Char-grilled cottage cheese cubes cooked in a thick, velvety spiced onion-tomato curry.",
        "price": "₹290",
        "category": "indian",
        "img": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-4",
        "title": "Dal Makhani & Jeera Rice",
        "desc": "Slow-cooked black lentils enriched with butter and cream, served with aromatic cumin rice.",
        "price": "₹260",
        "category": "indian",
        "img": "/dal_makhani.png",
        "is_available": True
    },
    {
        "id": "menu-5",
        "title": "Chole Bhature",
        "desc": "Spiced North Indian chickpea curry served with two fluffy golden fried bhaturas and pickles.",
        "price": "₹210",
        "category": "indian",
        "img": "/chole_bhature.png",
        "is_available": True
    },
    {
        "id": "menu-6",
        "title": "Royal Malai Kofta",
        "desc": "Crispy paneer and potato dumplings served in a creamy cashew and saffron curry sauce.",
        "price": "₹280",
        "category": "indian",
        "img": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    # Chinese
    {
        "id": "menu-7",
        "title": "Schezwan Hakka Noodles",
        "desc": "Wok-tossed noodles loaded with crisp vegetables, chili oil, and spicy Schezwan pepper sauce.",
        "price": "₹230",
        "category": "chinese",
        "img": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-8",
        "title": "Crispy Veg Manchurian",
        "desc": "Golden fried vegetable dumplings tossed in a savory garlic-soy sauce with fresh spring onions.",
        "price": "₹240",
        "category": "chinese",
        "img": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-9",
        "title": "Steamed Chicken Momos",
        "desc": "Handcrafted dumplings stuffed with juicy spiced minced chicken, served with spicy chili chutney.",
        "price": "₹220",
        "category": "chinese",
        "img": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-10",
        "title": "Kung Pao Chicken",
        "desc": "Stir-fried diced chicken with roasted peanuts, bell peppers, and signature chili soy glaze.",
        "price": "₹330",
        "category": "chinese",
        "img": "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-11",
        "title": "Chili Paneer Gravy",
        "desc": "Crispy fried cottage cheese cubes tossed with bell peppers and onions in a fiery Chinese chili sauce.",
        "price": "₹270",
        "category": "chinese",
        "img": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-12",
        "title": "Classic Yang Chow Fried Rice",
        "desc": "Fragrant wok-fried jasmine rice with sweet corn, peas, bell peppers, and light soy seasoning.",
        "price": "₹210",
        "category": "chinese",
        "img": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    # Western
    {
        "id": "menu-13",
        "title": "Truffle Ribeye Steak",
        "desc": "Premium cut ribeye, aged to perfection, served with truffle mash and seasonal asparagus.",
        "price": "₹390",
        "category": "western",
        "img": "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-14",
        "title": "Seared Atlantic Salmon",
        "desc": "Fresh caught salmon seared with a honey-soy glaze over a bed of wild quinoa.",
        "price": "₹350",
        "category": "western",
        "img": "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-15",
        "title": "Artisan Margherita Pizza",
        "desc": "Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, and aromatic basil.",
        "price": "₹280",
        "category": "western",
        "img": "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-16",
        "title": "Lobster Ravioli",
        "desc": "Handmade ravioli stuffed with fresh Maine lobster in a light lobster bisque cream sauce.",
        "price": "₹380",
        "category": "western",
        "img": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-17",
        "title": "Wagyu Beef Burger",
        "desc": "Half-pound Wagyu patty, aged cheddar, caramelized onions, brioche bun, and crisp fries.",
        "price": "₹320",
        "category": "western",
        "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    },
    {
        "id": "menu-18",
        "title": "Vegan Buddha Bowl",
        "desc": "Quinoa, roasted sweet potatoes, avocado, edamame, and creamy tahini dressing.",
        "price": "₹250",
        "category": "western",
        "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        "is_available": True
    }
]

class MenuService:
    async def seed_initial_menu(self):
        """Seed initial menu if database is empty."""
        if db_manager.use_memory_db:
            if not db_manager.memory_menu:
                db_manager.memory_menu = list(INITIAL_MENU)
        else:
            col = db_manager.menu_collection
            if col is not None:
                count = await col.count_documents({})
                if count == 0:
                    await col.insert_many([item.copy() for item in INITIAL_MENU])

    async def get_menu(self, category: Optional[str] = None) -> List[dict]:
        await self.seed_initial_menu()
        
        if db_manager.use_memory_db:
            items = db_manager.memory_menu
            if category and category != "all":
                return [i for i in items if i.get("category") == category]
            return items

        col = db_manager.menu_collection
        query = {}
        if category and category != "all":
            query["category"] = category
            
        cursor = col.find(query)
        items = []
        async for doc in cursor:
            doc["_id"] = str(doc.get("_id", doc.get("id")))
            if "id" not in doc:
                doc["id"] = doc["_id"]
            items.append(doc)
        return items

    async def add_menu_item(self, item_data: MenuItemCreate) -> dict:
        item_dict = item_data.dict()
        item_id = "menu-" + str(uuid.uuid4().hex[:6])
        item_dict["id"] = item_id

        if db_manager.use_memory_db:
            db_manager.memory_menu.append(item_dict)
        else:
            col = db_manager.menu_collection
            await col.insert_one(item_dict.copy())

        return item_dict

    async def get_categories(self) -> List[str]:
        items = await self.get_menu()
        categories = list(set(i.get("category") for i in items if i.get("category")))
        return sorted(categories)

menu_service = MenuService()
