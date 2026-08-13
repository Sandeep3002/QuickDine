document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('full-menu-container');
    
    const allDishes = [
        // --- Indian Food ---
        {
            title: "Butter Chicken & Garlic Naan",
            desc: "Tender chicken simmered in a rich, buttery tomato-cream gravy served with hot garlic naan.",
            price: "₹340",
            category: "indian",
            img: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Hyderabadi Chicken Biryani",
            desc: "Fragrant basmati rice layered with spiced marinated chicken, saffron, fried onions, and fresh mint.",
            price: "₹360",
            category: "indian",
            img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Paneer Tikka Masala",
            desc: "Char-grilled cottage cheese cubes cooked in a thick, velvety spiced onion-tomato curry.",
            price: "₹290",
            category: "indian",
            img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Dal Makhani & Jeera Rice",
            desc: "Slow-cooked black lentils enriched with butter and cream, served with aromatic cumin rice.",
            price: "₹260",
            category: "indian",
            img: "/dal_makhani.png"
        },
        {
            title: "Chole Bhature",
            desc: "Spiced North Indian chickpea curry served with two fluffy golden fried bhaturas and pickles.",
            price: "₹210",
            category: "indian",
            img: "/chole_bhature.png"
        },
        {
            title: "Royal Malai Kofta",
            desc: "Crispy paneer and potato dumplings served in a creamy cashew and saffron curry sauce.",
            price: "₹280",
            category: "indian",
            img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
        },

        // --- Chinese Food ---
        {
            title: "Schezwan Hakka Noodles",
            desc: "Wok-tossed noodles loaded with crisp vegetables, chili oil, and spicy Schezwan pepper sauce.",
            price: "₹230",
            category: "chinese",
            img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Crispy Veg Manchurian",
            desc: "Golden fried vegetable dumplings tossed in a savory garlic-soy sauce with fresh spring onions.",
            price: "₹240",
            category: "chinese",
            img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Steamed Chicken Momos",
            desc: "Handcrafted dumplings stuffed with juicy spiced minced chicken, served with spicy chili chutney.",
            price: "₹220",
            category: "chinese",
            img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Kung Pao Chicken",
            desc: "Stir-fried diced chicken with roasted peanuts, bell peppers, and signature chili soy glaze.",
            price: "₹330",
            category: "chinese",
            img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Chili Paneer Gravy",
            desc: "Crispy fried cottage cheese cubes tossed with bell peppers and onions in a fiery Chinese chili sauce.",
            price: "₹270",
            category: "chinese",
            img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Classic Yang Chow Fried Rice",
            desc: "Fragrant wok-fried jasmine rice with sweet corn, peas, bell peppers, and light soy seasoning.",
            price: "₹210",
            category: "chinese",
            img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"
        },

        // --- Western Specials ---
        {
            title: "Truffle Ribeye Steak",
            desc: "Premium cut ribeye, aged to perfection, served with truffle mash and seasonal asparagus.",
            price: "₹390",
            category: "western",
            img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Seared Atlantic Salmon",
            desc: "Fresh caught salmon seared with a honey-soy glaze over a bed of wild quinoa.",
            price: "₹350",
            category: "western",
            img: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Artisan Margherita Pizza",
            desc: "Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, and aromatic basil.",
            price: "₹280",
            category: "western",
            img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Lobster Ravioli",
            desc: "Handmade ravioli stuffed with fresh Maine lobster in a light lobster bisque cream sauce.",
            price: "₹380",
            category: "western",
            img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Wagyu Beef Burger",
            desc: "Half-pound Wagyu patty, aged cheddar, caramelized onions, brioche bun, and crisp fries.",
            price: "₹320",
            category: "western",
            img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Vegan Buddha Bowl",
            desc: "Quinoa, roasted sweet potatoes, avocado, edamame, and creamy tahini dressing.",
            price: "₹250",
            category: "western",
            img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const renderMenu = (filterCategory = 'all') => {
        const filteredDishes = filterCategory === 'all' 
            ? allDishes 
            : allDishes.filter(d => d.category === filterCategory);

        const cardsHtml = filteredDishes.map((dish, i) => `
            <div class="card animate-up" style="animation-delay: ${0.05 * (i % 6)}s">
                <div style="overflow: hidden; position: relative;">
                    <img src="${dish.img}" alt="${dish.title}" class="card-img" />
                    <span style="position: absolute; top: 12px; right: 12px; background: rgba(15, 16, 20, 0.85); backdrop-filter: blur(5px); color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; border: 1px solid rgba(255,255,255,0.1);">
                        ${dish.category === 'indian' ? '🇮🇳 Indian' : dish.category === 'chinese' ? '🥢 Chinese' : '🍝 Western'}
                    </span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${dish.title}</h3>
                    <p class="card-desc">${dish.desc}</p>
                    <div class="card-footer">
                        <span class="price">${dish.price}</span>
                        <button class="cta-btn primary-btn add-to-order-btn" data-title="${dish.title}" data-price="${dish.price}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');

        if (menuContainer) {
            menuContainer.innerHTML = cardsHtml;
        }

        // Attach add to cart handlers
        document.querySelectorAll('.add-to-order-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                const price = this.getAttribute('data-price');
                const originalText = this.innerText;
                if(originalText !== 'Add to Cart') return;
                
                if(window.addToCart) {
                    window.addToCart(title, price);
                }
                
                this.innerText = 'Added ✓';
                this.style.background = '#2ed573';
                this.style.boxShadow = '0 4px 15px rgba(46, 213, 115, 0.4)';
                this.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.background = '';
                    this.style.boxShadow = '';
                }, 2000);
            });
        });
    };

    // Category filter click events
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-category');
            renderMenu(category);
        });
    });

    renderMenu('all');
});

