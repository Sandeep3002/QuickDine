// QuickDine Main Javascript
document.addEventListener('DOMContentLoaded', () => {
    const featuresSection = document.querySelector('.features');
    
    const dishes = [
        {
            title: "Dal Makhani & Jeera Rice",
            desc: "Slow-cooked black lentils enriched with butter and cream, served with aromatic cumin rice.",
            price: "₹260",
            img: "/dal_makhani.png"
        },
        {
            title: "Truffle Ribeye Steak",
            desc: "Premium cut ribeye, aged to perfection, served with truffle mash and seasonal asparagus.",
            price: "₹390",
            img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Seared Atlantic Salmon",
            desc: "Fresh caught salmon seared with a honey-soy glaze, over a bed of wild quinoa.",
            price: "₹350",
            img: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Artisan Margherita",
            desc: "Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, and aromatic basil.",
            price: "₹280",
            img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const cardsHtml = dishes.map((dish, i) => `
        <div class="card animate-up" style="animation-delay: ${0.2 * (i + 1)}s">
            <div style="overflow: hidden;">
                <img src="${dish.img}" alt="${dish.title}" class="card-img" />
            </div>
            <div class="card-content">
                <h3 class="card-title">${dish.title}</h3>
                <p class="card-desc">${dish.desc}</p>
                <div class="card-footer">
                    <span class="price">${dish.price}</span>
                    <button class="cta-btn primary-btn add-to-order-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');

    featuresSection.innerHTML = `
        <h2 class="section-title animate-up">Signature Dishes</h2>
        <div class="cards-container">
            ${cardsHtml}
        </div>
    `;

    // Interactive elements for the "Add to Order" buttons
    const buttons = document.querySelectorAll('.add-to-order-btn');
    buttons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const originalText = this.innerText;
            if(originalText !== 'Add to Cart') return;
            
            if(window.addToCart) {
                window.addToCart(dishes[index].title, dishes[index].price);
            }
            
            this.innerText = 'Added ✓';
            this.style.background = '#2ed573'; // Success green
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

    // --- Hero Buttons Functionality ---
    
    // View Menu Button: Go to Menu page
    const viewMenuBtn = document.getElementById('view-menu-btn');
    if (viewMenuBtn) {
        viewMenuBtn.addEventListener('click', () => {
            window.location.href = '/menu.html';
        });
    }

    // Book a Table Button: Go to Reservations page
    const bookTableBtn = document.getElementById('book-table-btn');
    if (bookTableBtn) {
        bookTableBtn.addEventListener('click', () => {
            window.location.href = '/reservations.html';
        });
    }
});
