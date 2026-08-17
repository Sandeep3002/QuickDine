// cart.js - QR Code Table Ordering & Cart System
const initCart = () => {
    if(document.getElementById('cart-modal')) return;

    // ── Network host & Base URL ────────────────────────────────────────────────
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const LAN_IP = '192.168.1.11';           // your PC's local network IP
    const BACKEND_PORT  = '8000';

    // SITE_BASE: For QR codes. In production (Vercel), use clean origin (https://my-app.vercel.app)
    // In local dev, use http://${LAN_IP}:5173 so scanned phones reach local PC.
    const SITE_BASE = isLocal 
        ? `http://${LAN_IP}:${window.location.port || '5173'}` 
        : window.location.origin;

    // API_BASE: Backend API URL
    const API_BASE = isLocal 
        ? `http://${window.location.hostname}:${BACKEND_PORT}` 
        : `http://${window.location.hostname}:${BACKEND_PORT}`;
    
    // Cloud API for instant cross-device order sync (Mobile Phone <-> Owner Laptop)
    const CLOUD_API_URL = 'https://crudcrud.com/api/e5a9c6fc83b74efc9ced302d8cbc80a0/orders';
    // ─────────────────────────────────────────────────────────────────────────

    // Detect Table Number from URL query parameter (e.g. ?table=5) or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const tableFromUrl = urlParams.get('table');          // set when scanned via QR code
    if (tableFromUrl) {
        localStorage.setItem('quickdine_qr_scanned', 'true');
    }
    let currentTable = tableFromUrl || localStorage.getItem('quickdine_table') || '4';
    localStorage.setItem('quickdine_table', currentTable);

    // If customer scanned a QR code, lock the table for them (hide QR modal & QR text).
    const isQrScanned = Boolean(tableFromUrl || localStorage.getItem('quickdine_qr_scanned'));

    // Dynamic QR & Cart Modals
    const modalsHtml = `
    <!-- Cart Modal -->
    <div id="cart-modal" class="modal-overlay hidden" style="z-index: 3000;">
      <div id="cart-modal-content" class="modal-content" style="max-width: 850px; width: 90%; color: white; transition: all 0.3s ease;">
        <div id="cart-modal-body">
            <!-- Rendered dynamically -->
        </div>
      </div>
    </div>

    <!-- QR Code Table Modal -->
    <div id="qr-modal" class="modal-overlay hidden" style="z-index: 3005;">
      <div class="modal-content" style="max-width: 480px; color: white; text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 1.6rem; color: #fff;">📱 Table QR Ordering</h2>
            <button id="close-qr-modal-btn" style="background: none; border: none; color: var(--text-muted); font-size: 1.8rem; cursor: pointer;">&times;</button>
        </div>
        
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
            Scan the QR code at your dining table to browse the menu and order directly to your table!
        </p>

        <div style="background: #ffffff; padding: 15px; border-radius: 16px; display: inline-block; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 20px;">
            <img id="qr-code-img" src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(SITE_BASE + '/menu.html?table=' + currentTable)}" alt="Table QR Code" style="width: 180px; height: 180px; display: block;" />
            <div id="qr-target-url" style="font-size: 0.75rem; color: #555; margin-top: 8px; word-break: break-all; max-width: 200px; font-weight: 500;">${SITE_BASE}/menu.html?table=${currentTable}</div>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 1.1rem; color: var(--primary);">Active Table: <span id="modal-active-table" style="color: #fff;">Table #${currentTable}</span></p>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.85rem;">Select your table below to simulate QR Code scanning:</p>
            
            <div id="table-select-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 12px;">
                <!-- Tables 1 to 10 injected via JS -->
            </div>
        </div>

        <button id="confirm-table-btn" class="cta-btn primary-btn" style="width: 100%; font-size: 1rem; padding: 12px;">
            Done / Continue Ordering
        </button>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalsHtml);

    // Inject Floating QR Table Badge
    if (!document.getElementById('header-table-badge')) {
        const qrSuffixHtml = isQrScanned ? '' : `<span style="font-size: 0.95rem; color: var(--primary); font-weight: bold;">QR 📱</span>`;
        const cursorStyle = isQrScanned ? 'default' : 'pointer';

        const tableBadgeHtml = `
        <div id="header-table-badge" style="position: fixed; bottom: 30px; left: 30px; z-index: 2000; display: inline-flex; align-items: center; gap: 8px; background: rgba(20, 22, 32, 0.85); border: 1px solid rgba(255,255,255,0.15); border-radius: 40px; padding: 10px 20px; cursor: ${cursorStyle}; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.5); backdrop-filter: blur(10px);">
            <span style="width: 10px; height: 10px; background: #2ed573; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #2ed573;"></span>
            <span id="header-table-name" style="font-size: 1.05rem; font-weight: 600; color: #fff;">Table #${currentTable}</span>
            ${qrSuffixHtml}
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', tableBadgeHtml);
    }

    const cartModal = document.getElementById('cart-modal');
    const qrModal = document.getElementById('qr-modal');
    let cart = JSON.parse(localStorage.getItem('quickdine_cart')) || [];
    let placedOrders = JSON.parse(localStorage.getItem('quickdine_placed_orders')) || [];
    let isOrderConfirmed = false;

    // Table Selector Grid Logic
    const renderTableSelector = () => {
        const grid = document.getElementById('table-select-grid');
        if (!grid) return;
        let html = '';
        for (let i = 1; i <= 10; i++) {
            const isActive = i.toString() === currentTable.toString();
            html += `
            <button class="table-btn ${isActive ? 'active-table' : ''}" data-table="${i}" style="padding: 8px 0; border-radius: 8px; border: 1px solid ${isActive ? 'var(--primary)' : 'rgba(255,255,255,0.15)'}; background: ${isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}; color: white; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s ease;">
                #${i}
            </button>
            `;
        }
        grid.innerHTML = html;

        grid.querySelectorAll('.table-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedTable = e.target.getAttribute('data-table');
                switchTable(selectedTable);
            });
        });
    };

    const switchTable = (newTable) => {
        currentTable = newTable;
        localStorage.setItem('quickdine_table', currentTable);

        // Update URL query string without reloading page
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('table', currentTable);
        window.history.replaceState({}, '', newUrl);

        // Update UI
        const headerTableName = document.getElementById('header-table-name');
        if (headerTableName) headerTableName.innerText = `Table #${currentTable}`;

        const modalActiveTable = document.getElementById('modal-active-table');
        if (modalActiveTable) modalActiveTable.innerText = `Table #${currentTable}`;

        const qrCodeImg = document.getElementById('qr-code-img');
        const targetUrl = `${SITE_BASE}/menu.html?table=${currentTable}`;
        if (qrCodeImg) qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(targetUrl)}`;

        const qrTargetUrl = document.getElementById('qr-target-url');
        if (qrTargetUrl) qrTargetUrl.innerText = targetUrl;

        renderTableSelector();
    };

    const renderCartView = () => {
        isOrderConfirmed = false;
        const cartModalBody = document.getElementById('cart-modal-body');
        cartModalBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="color: var(--primary); margin: 0; font-size: 1.8rem;">Your Order</h2>
                <span style="background: rgba(46, 213, 115, 0.15); border: 1px solid #2ed573; color: #2ed573; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                    🪑 Table #${currentTable}
                </span>
            </div>
            <div id="cart-items" style="margin: 20px 0; max-height: 380px; overflow-y: auto;"></div>
            <div id="cart-footer-section">
                <div style="display: flex; justify-content: space-between; font-size: 1.4rem; font-weight: 800; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; margin-bottom: 25px;">
                    <span>Total:</span>
                    <span id="cart-total" style="color: var(--primary);">₹0</span>
                </div>
                <div id="cart-action-buttons" style="display: flex; gap: 15px;">
                    <button id="checkout-btn" class="cta-btn primary-btn" style="flex: 1; font-size: 1.1rem;">Place Table Order</button>
                    <button id="close-cart-btn" class="cta-btn secondary-btn" style="flex: 1; font-size: 1.1rem;">Add More</button>
                </div>
            </div>
        `;

        attachCartViewEvents();
        updateCartUI();
    };

    const updateHeaderBadge = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.header-cart-count').forEach(countEl => {
            if (totalItems > 0) {
                countEl.style.display = 'flex';
                countEl.innerText = totalItems;
            } else {
                countEl.style.display = 'none';
            }
        });
    };

    const updateCartUI = async () => {
        updateHeaderBadge();
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        const cartModalContent = document.getElementById('cart-modal-content');
        if (!cartItemsContainer || !cartTotalEl) return;

        // Fetch live orders for this table from backend
        let liveOrders = [];
        try {
            const res = await fetch(`${API_BASE}/api/orders`);
            if (!res.ok) throw new Error('Backend HTTP error');
            const data = await res.json();
            liveOrders = data.filter(o => o.table_number.toString() === currentTable.toString() && o.status !== 'paid');
        } catch (err) {
            console.warn('Backend API offline, using local placed orders fallback');
            if (placedOrders.length > 0) {
                let totalAmount = 0;
                placedOrders.forEach(item => {
                    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
                    totalAmount += price * item.quantity;
                });
                liveOrders = [{
                    id: 'QD-LOCAL',
                    table_number: currentTable,
                    items: placedOrders,
                    total_amount: totalAmount,
                    status: 'preparing'
                }];
            }
        }

        // Dynamic modal width based on split layout
        if (cartModalContent) {
            cartModalContent.style.maxWidth = (liveOrders.length > 0 && cart.length > 0) ? '850px' : '500px';
        }

        const topFooterSection = document.getElementById('cart-footer-section');
        if (topFooterSection) {
            topFooterSection.style.display = 'block';
        }

        if (cart.length === 0 && liveOrders.length === 0) {
            cartItemsContainer.style.display = 'block';
            cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; font-size: 1.1rem; margin: 40px 0;">Your cart is empty. Scan QR or pick items to order!</p>';
            cartTotalEl.innerText = '₹0';
            return;
        }

        let total = 0;
        let html = '';
        const showSplit = liveOrders.length > 0 && cart.length > 0;
        
        if (showSplit) {
            cartItemsContainer.style.display = 'grid';
            cartItemsContainer.style.gridTemplateColumns = '1fr 1fr';
            cartItemsContainer.style.gap = '25px';
        } else {
            cartItemsContainer.style.display = 'block';
        }

        // --- Left Column: Live Orders ---
        if (liveOrders.length > 0) {
            if (showSplit) html += `<div>`;
            html += `<h3 style="color: #2ed573; margin-top: 0; font-size: 1.05rem; margin-bottom: 12px; border-bottom: 1px solid rgba(46, 213, 115, 0.2); padding-bottom: 5px;">Live Kitchen Status</h3>`;
            
            liveOrders.forEach(order => {
                total += order.total_amount;
                let statusHtml = '';
                if (order.status === 'pending') {
                    statusHtml = `<span style="color: #ffc107; font-weight: 700; font-size: 0.85rem; background: rgba(255,193,7,0.15); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255,193,7,0.3);">🕒 Pending</span>`;
                } else if (order.status === 'preparing') {
                    statusHtml = `<span style="color: #3498db; font-weight: 700; font-size: 0.85rem; background: rgba(52,152,219,0.15); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(52,152,219,0.3);">👨‍🍳 Preparing</span>`;
                } else if (order.status === 'ready_for_waiter') {
                    statusHtml = `<span style="color: #2ed573; font-weight: 700; font-size: 0.85rem; background: rgba(46,213,115,0.2); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(46,213,115,0.4); box-shadow: 0 0 10px rgba(46,213,115,0.3);">🔔 Ready to Serve!</span>`;
                } else if (order.status === 'served') {
                    statusHtml = `<span style="color: #95a5a6; font-weight: 700; font-size: 0.85rem; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15);">✅ Served</span>`;
                }

                html += `<div style="margin-bottom: 15px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 0.85rem; color: var(--text-muted);">Order ${order.id}</span>
                                ${statusHtml}
                            </div>`;
                
                order.items.forEach(item => {
                    html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; background: rgba(255,255,255,0.02); padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                        <div>
                            <h4 style="margin: 0 0 3px 0; font-size: 1rem; color: #fff;">${item.title}</h4>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">Qty: ${item.quantity}</span>
                        </div>
                    </div>
                    `;
                });
                html += `</div>`;
            });
            if (showSplit) html += `</div>`;
        }

        // --- Right Column: New Items ---
        if (cart.length > 0) {
            if (showSplit) html += `<div>`;
            html += `<h3 style="color: var(--primary); margin-top: ${showSplit ? '0' : '25px'}; font-size: 1.05rem; margin-bottom: 12px; border-bottom: 1px solid rgba(255, 71, 87, 0.2); padding-bottom: 5px;">New Items to Order</h3>`;
            html += cart.map(item => {
                const price = parseInt(item.price.replace(/[^0-9]/g, ''));
                total += price * item.quantity;
                return `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                    <div>
                        <h4 style="margin: 0 0 5px 0; font-size: 1.05rem;">${item.title}</h4>
                        <span style="color: var(--primary); font-weight: bold;">${item.price}</span> <span style="color: var(--text-muted);">x ${item.quantity}</span>
                    </div>
                    <button class="remove-item-btn cta-btn secondary-btn" data-title="${item.title}" style="padding: 6px 14px; font-size: 0.85rem;">Remove</button>
                </div>
                `;
            }).join('');
            if (showSplit) html += `</div>`;
        }

        cartItemsContainer.innerHTML = html;
        cartTotalEl.innerText = `₹${total}`;

        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                cart = cart.filter(item => item.title !== title);
                saveCart();
            });
        });

        // --- Payment Logic ---
        let liveTotal = 0;
        liveOrders.forEach(o => liveTotal += o.total_amount);

        const actionButtons = document.getElementById('cart-action-buttons');
        const footerSection = document.getElementById('cart-footer-section');
        if (actionButtons) {
             if (cart.length === 0 && liveOrders.length > 0) {
                 actionButtons.innerHTML = `
                     <button id="bring-bill-btn" class="cta-btn primary-btn" style="flex: 1; font-size: 1.1rem; background: #2ed573; border-color: #2ed573; box-shadow: 0 4px 15px rgba(46,213,115,0.4);">Bring the Bill (₹${liveTotal})</button>
                     <button id="close-cart-btn" class="cta-btn secondary-btn" style="flex: 1; font-size: 1.1rem;">Add More Food</button>
                 `;
                 
                 document.getElementById('bring-bill-btn').addEventListener('click', async () => {
                     const btn = document.getElementById('bring-bill-btn');
                     btn.innerText = 'Requesting Bill...';
                     btn.disabled = true;
                     
                     setTimeout(async () => {
                         // Mark all as bill_requested in backend
                         for (let o of liveOrders) {
                             try {
                                 await fetch(`${API_BASE}/api/orders/${o.id}/status?status=bill_requested`, { method: 'PUT' });
                             } catch(e) {}
                         }
                         
                         localStorage.removeItem('quickdine_placed_orders');
                         localStorage.removeItem('quickdine_cart');
                         localStorage.removeItem('quickdine_qr_scanned');
                         placedOrders = [];
                         cart = [];
                         
                         cartItemsContainer.style.display = 'block';
                         cartItemsContainer.innerHTML = `
                            <div style="text-align: center; padding: 40px 0;">
                                <div style="font-size: 3.5rem; margin-bottom: 10px;">🧾</div>
                                <h2 style="color: #2ed573; margin: 0 0 10px 0; font-size: 1.8rem; font-weight: 800;">Bill Requested!</h2>
                                <p style="color: #ffffff; font-size: 1.05rem; margin-bottom: 8px;">Our waiter will bring your physical bill to <strong>Table #${currentTable}</strong> shortly.</p>
                                <p style="color: var(--text-muted); font-size: 0.9rem;">Thank you for dining with us!</p>
                                <button id="reset-session-btn" class="cta-btn primary-btn" style="margin-top: 18px; font-size: 1rem; padding: 10px 22px; background: #3498db; border: none; box-shadow: 0 4px 15px rgba(52,152,219,0.4);">Done / Reset Table</button>
                            </div>
                         `;
                         if (footerSection) footerSection.style.display = 'none';
                         updateHeaderBadge();

                         const resetBtn = document.getElementById('reset-session-btn');
                         if (resetBtn) {
                             resetBtn.addEventListener('click', () => {
                                 closeModal();
                                 window.location.href = 'menu.html';
                             });
                         }
                     }, 1200);
                 });
             } else {
                 actionButtons.innerHTML = `
                     <button id="checkout-btn" class="cta-btn primary-btn" style="flex: 1; font-size: 1.1rem;">Place Table Order</button>
                     <button id="close-cart-btn" class="cta-btn secondary-btn" style="flex: 1; font-size: 1.1rem;">Add More</button>
                 `;
                 attachCartViewEvents();
             }
             
             const closeBtn = document.getElementById('close-cart-btn');
             if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
        }
    };

    const saveCart = () => {
        localStorage.setItem('quickdine_cart', JSON.stringify(cart));
        updateCartUI();
    };

    const attachCartViewEvents = () => {
        const closeCartBtn = document.getElementById('close-cart-btn');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => closeModal());
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', async () => {
                if (cart.length === 0) return;
                
                const orderedItems = [...cart];
                let totalAmount = 0;
                orderedItems.forEach(item => {
                    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
                    totalAmount += price * item.quantity;
                });

                checkoutBtn.innerText = 'Sending to Kitchen...';
                checkoutBtn.disabled = true;

                try {
                    const apiUrl = `${API_BASE}/api/orders`;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            table_number: currentTable,
                            items: orderedItems,
                            total_amount: totalAmount
                        })
                    });
                    if (!response.ok) throw new Error('Backend HTTP error');
                    const data = await response.json();
                    
                    const cleanTableNum = parseInt((currentTable || '1').toString().replace(/[^0-9]/g, ''), 10) || 1;
                    const orderRecord = {
                        id: data.id || ('QD-' + Math.floor(100000 + Math.random() * 900000)),
                        table_number: cleanTableNum,
                        items: orderedItems,
                        total_amount: totalAmount,
                        status: 'pending',
                        created_at: new Date().toISOString()
                    };

                    fetch(CLOUD_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderRecord)
                    }).catch(e => console.warn("Cloud sync error:", e));

                    let allGlobalOrders = JSON.parse(localStorage.getItem('quickdine_all_orders')) || [];
                    allGlobalOrders.push(orderRecord);
                    localStorage.setItem('quickdine_all_orders', JSON.stringify(allGlobalOrders));

                    placedOrders.push(...orderedItems);
                    localStorage.setItem('quickdine_placed_orders', JSON.stringify(placedOrders));
                    cart = [];
                    localStorage.setItem('quickdine_cart', JSON.stringify(cart));
                    updateHeaderBadge();
                    showOrderConfirmation(orderedItems, totalAmount, data.id);
                } catch (error) {
                    console.warn("Backend API unreachable, placing order locally and cloud syncing:", error);
                    const fallbackOrderId = 'QD-' + Math.floor(100000 + Math.random() * 900000);
                    const cleanTableNum = parseInt((currentTable || '1').toString().replace(/[^0-9]/g, ''), 10) || 1;

                    const orderRecord = {
                        id: fallbackOrderId,
                        table_number: cleanTableNum,
                        items: orderedItems,
                        total_amount: totalAmount,
                        status: 'pending',
                        created_at: new Date().toISOString()
                    };

                    fetch(CLOUD_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderRecord)
                    }).catch(e => console.warn("Cloud sync error:", e));

                    let allGlobalOrders = JSON.parse(localStorage.getItem('quickdine_all_orders')) || [];
                    allGlobalOrders.push(orderRecord);
                    localStorage.setItem('quickdine_all_orders', JSON.stringify(allGlobalOrders));

                    placedOrders.push(...orderedItems);
                    localStorage.setItem('quickdine_placed_orders', JSON.stringify(placedOrders));
                    cart = [];
                    localStorage.setItem('quickdine_cart', JSON.stringify(cart));
                    updateHeaderBadge();
                    showOrderConfirmation(orderedItems, totalAmount, fallbackOrderId);
                }
            });
        }
    };

    const showOrderConfirmation = (items, totalAmount, serverOrderId) => {
        isOrderConfirmed = true;
        const cartModalBody = document.getElementById('cart-modal-body');
        const orderId = serverOrderId || 'QD-' + Math.floor(100000 + Math.random() * 900000);

        const itemsListHtml = items.map(item => {
            const unitPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
            const itemTotal = unitPrice * item.quantity;
            return `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                <div>
                    <h4 style="margin: 0 0 2px 0; font-size: 1rem; color: #fff;">${item.title}</h4>
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Qty: ${item.quantity} × ${item.price}</span>
                </div>
                <span style="color: var(--primary); font-weight: 700; font-size: 1rem;">₹${itemTotal}</span>
            </div>
            `;
        }).join('');

        cartModalBody.innerHTML = `
            <div style="text-align: center; margin-bottom: 18px;">
                <div style="width: 55px; height: 55px; background: rgba(46, 213, 115, 0.15); border: 2px solid #2ed573; color: #2ed573; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin: 0 auto 12px auto;">✓</div>
                <h2 style="color: #2ed573; margin: 0 0 4px 0; font-size: 1.7rem; font-weight: 800;">Order Sent to Kitchen!</h2>
                <p style="color: var(--text-muted); margin: 0; font-size: 0.9rem;">Order ID: <span style="color: #fff; font-weight: 600;">${orderId}</span> • <span style="color: #2ed573; font-weight: 600;">Table #${currentTable}</span></p>
            </div>

            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; margin-bottom: 18px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 8px;">
                    <h3 style="margin: 0; font-size: 1.05rem; color: #fff;">Kitchen Receipt Summary</h3>
                    <span style="background: rgba(255, 71, 87, 0.2); color: var(--primary); border: 1px solid var(--primary); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">👨‍🍳 Preparing</span>
                </div>
                <div style="max-height: 220px; overflow-y: auto; padding-right: 4px;">
                    ${itemsListHtml}
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 12px;">
                    <span>Total Paid:</span>
                    <span style="color: var(--primary);">₹${totalAmount}</span>
                </div>
            </div>

            <p style="text-align: center; color: var(--text-muted); font-size: 0.88rem; margin-bottom: 18px;">
                ⏱️ Estimated Delivery to <strong>Table #${currentTable}</strong>: <strong style="color: #fff;">15 - 20 mins</strong>
            </p>

            <button id="confirm-done-btn" class="cta-btn primary-btn" style="width: 100%; font-size: 1.05rem; padding: 12px; background: #2ed573; border: none; box-shadow: 0 4px 15px rgba(46, 213, 115, 0.4);">
                Done / Add More Items
            </button>
        `;

        document.getElementById('confirm-done-btn').addEventListener('click', () => {
            isOrderConfirmed = false;
            renderCartView();
        });
    };

    const closeModal = () => {
        cartModal.classList.add('hidden');
        if (isOrderConfirmed) {
            isOrderConfirmed = false;
            renderCartView();
        }
    };

    window.addToCart = (title, price) => {
        if (isOrderConfirmed) {
            isOrderConfirmed = false;
            renderCartView();
        }
        const existing = cart.find(item => item.title === title);
        if (existing) existing.quantity += 1;
        else cart.push({ title, price, quantity: 1 });
        saveCart();
        updateCartUI();
        cartModal.classList.remove('hidden');
    };

    const openCart = (e) => {
        if (e) e.preventDefault();
        renderCartView();
        cartModal.classList.remove('hidden');
    };

    const openQRModal = () => {
        renderTableSelector();
        qrModal.classList.remove('hidden');
    };

    // Event listeners
    document.querySelectorAll('.header-cart').forEach(btn => {
        btn.addEventListener('click', openCart);
    });

    const headerTableBadge = document.getElementById('header-table-badge');
    if (headerTableBadge && !isQrScanned) {
        headerTableBadge.addEventListener('click', openQRModal);
    }

    const closeQrModalBtn = document.getElementById('close-qr-modal-btn');
    if (closeQrModalBtn) {
        closeQrModalBtn.addEventListener('click', () => qrModal.classList.add('hidden'));
    }

    const confirmTableBtn = document.getElementById('confirm-table-btn');
    if (confirmTableBtn) {
        confirmTableBtn.addEventListener('click', () => qrModal.classList.add('hidden'));
    }

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeModal();
    });

    qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) qrModal.classList.add('hidden');
    });

    renderCartView();

    // Auto-refresh live kitchen status every 3 seconds
    setInterval(() => {
        if (!cartModal.classList.contains('hidden') && !isOrderConfirmed) {
            updateCartUI();
        }
    }, 3000);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}


