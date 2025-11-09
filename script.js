// ===== ZUVANI TEES - MAIN FUNCTIONALITY =====
class ZuvaniStore {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('zuvani_products')) || this.getDefaultProducts();
        this.cart = JSON.parse(localStorage.getItem('zuvani_cart')) || [];
        this.orders = JSON.parse(localStorage.getItem('zuvani_orders')) || [];
        this.customers = JSON.parse(localStorage.getItem('zuvani_customers')) || [];
        this.adminPassword = localStorage.getItem('zuvani_admin_password') || 'zuvani2025';
        this.businessSettings = JSON.parse(localStorage.getItem('zuvani_business_settings')) || this.getDefaultBusinessSettings();
        
        this.init();
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Classic Round Neck Tee",
                price: 1200,
                category: "t-shirts",
                image: "images/tee1.jpg",
                description: "Premium cotton round neck t-shirt with exclusive Zuvani print. Comfortable and stylish for everyday wear.",
                stock: 15,
                status: "available",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "White", "Navy"],
                featured: true
            },
            {
                id: 2,
                name: "Premium Polo Shirt",
                price: 1500,
                category: "polo",
                image: "images/polo1.jpg",
                description: "Quality polo shirt perfect for casual outings. Made with breathable fabric for all-day comfort.",
                stock: 10,
                status: "available",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "White", "Grey"],
                featured: true
            },
            {
                id: 3,
                name: "Urban Street Hoodie",
                price: 2500,
                category: "hoodies",
                image: "images/hoodie1.jpg",
                description: "Comfortable hoodie for street style enthusiasts. Perfect for Nairobi's cool evenings.",
                stock: 8,
                status: "available",
                sizes: ["M", "L", "XL"],
                colors: ["Black", "Grey", "Navy"],
                featured: true
            },
            {
                id: 4,
                name: "Basic Crew Neck",
                price: 1100,
                category: "t-shirts",
                image: "images/tee2.jpg",
                description: "Essential crew neck t-shirt for your everyday wardrobe. Simple, comfortable, and versatile.",
                stock: 20,
                status: "available",
                sizes: ["S", "M", "L", "XL"],
                colors: ["Black", "White", "Red"],
                featured: false
            }
        ];
    }

    getDefaultBusinessSettings() {
        return {
            storeName: "Zuvani Tees",
            phone: "0758619460",
            email: "info@zuvanitees.com",
            personalEmail: "eunicekironyo@gmail.com",
            location: "Marurui, Nairobi, Kenya",
            description: "Premium streetwear brand offering quality t-shirts, polo shirts, and hoodies. Own your vibe, wear your story.",
            businessHours: {
                weekdays: "8:00 AM - 8:00 PM",
                saturday: "9:00 AM - 6:00 PM",
                sunday: "10:00 AM - 4:00 PM"
            },
            socialMedia: {
                whatsapp: "0758619460",
                instagram: "#",
                tiktok: "#",
                facebook: "#"
            }
        };
    }

    init() {
        this.saveProducts();
        this.displayProducts();
        this.updateCartCount();
        this.setupEventListeners();
        this.updateBusinessInfo();
    }

    setupEventListeners() {
        // Cart toggle
        document.getElementById('cart-toggle')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cart = document.getElementById('cart-sidebar');
            const cartToggle = document.getElementById('cart-toggle');
            if (cart?.classList.contains('active') && 
                !cart.contains(e.target) && 
                !cartToggle.contains(e.target)) {
                this.closeCart();
            }
        });

        // Filter products
        document.querySelectorAll('.filter-btn')?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    // PRODUCT MANAGEMENT
    saveProducts() {
        localStorage.setItem('zuvani_products', JSON.stringify(this.products));
    }

    displayProducts(containerId = 'products-container', category = 'all') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let filteredProducts = this.products;
        if (category !== 'all') {
            filteredProducts = this.products.filter(product => product.category === category);
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tshirt"></i>
                    <h3>No products found</h3>
                    <p>No products available in this category yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    ${product.image && product.image.startsWith('images/') ? 
                        `<div class="image-placeholder">
                            <i class="fas fa-tshirt"></i>
                            <p>${product.name}</p>
                            <small>Image: ${product.image}</small>
                        </div>` : 
                        `<div class="image-placeholder">
                            <i class="fas fa-tshirt"></i>
                            <p>${product.name}</p>
                            <small>Add product image</small>
                        </div>`
                    }
                    ${product.featured ? '<div class="featured-badge">🔥 Featured</div>' : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-meta">
                        <div class="product-sizes">
                            <small>Sizes: ${product.sizes?.join(', ') || 'One Size'}</small>
                        </div>
                        <div class="product-colors">
                            <small>Colors: ${product.colors?.join(', ') || 'Various'}</small>
                        </div>
                    </div>
                    
                    <p class="product-price">KSh ${product.price.toLocaleString()}</p>
                    
                    <div class="product-actions">
                        <button class="cta-button small" onclick="store.addToCart(${product.id})" 
                                ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <span class="status-${product.status}">
                            <i class="fas fa-circle"></i> ${product.status}
                        </span>
                    </div>
                    
                    <div class="product-stock">
                        <small>${product.stock} items in stock</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // CART MANAGEMENT
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock === 0) {
            this.showNotification('This product is out of stock!', 'error');
            return;
        }

        const cartItem = this.cart.find(item => item.id === productId);
        
        if (cartItem) {
            if (cartItem.quantity < product.stock) {
                cartItem.quantity++;
                this.showNotification(`Updated quantity for ${product.name}`, 'success');
            } else {
                this.showNotification(`Only ${product.stock} items available in stock`, 'warning');
                return;
            }
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                selectedSize: product.sizes?.[0] || 'One Size',
                selectedColor: product.colors?.[0] || 'Default'
            });
            this.showNotification(`${product.name} added to cart!`, 'success');
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Item removed from cart', 'info');
    }

    updateQuantity(productId, change) {
        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            const product = this.products.find(p => p.id === productId);
            const newQuantity = cartItem.quantity + change;
            
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else if (newQuantity > (product?.stock || 0)) {
                this.showNotification(`Only ${product.stock} items available`, 'warning');
            } else {
                cartItem.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            }
        }
    }

    saveCart() {
        localStorage.setItem('zuvani_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            countElement.textContent = totalItems;
        }
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <small>Add some products to get started!</small>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <div class="image-placeholder small">
                                <i class="fas fa-tshirt"></i>
                            </div>
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-meta">
                                <small>Size: ${item.selectedSize}</small>
                                <small>Color: ${item.selectedColor}</small>
                            </div>
                            <p class="product-price">KSh ${item.price.toLocaleString()}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, -1)">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="store.updateQuantity(${item.id}, 1)">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item" onclick="store.removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `KSh ${total.toLocaleString()}`;
        }
    }

    // CHECKOUT PROCESS
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Show checkout modal
        this.showCheckoutModal(total);
    }

    showCheckoutModal(total) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3><i class="fas fa-shopping-bag"></i> Complete Your Order</h3>
                    <button onclick="this.closest('.modal').remove()" class="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        ${this.cart.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>KSh ${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                        <div class="order-total">
                            <strong>Total: KSh ${total.toLocaleString()}</strong>
                        </div>
                    </div>

                    <div class="checkout-options">
                        <h4>Choose Payment Method</h4>
                        <div class="payment-options">
                            <button class="payment-option" onclick="store.processOrder('mpesa')">
                                <i class="fas fa-mobile-alt"></i>
                                <span>M-Pesa</span>
                                <small>Pay via M-Pesa</small>
                            </button>
                            <button class="payment-option" onclick="store.processOrder('whatsapp')">
                                <i class="fab fa-whatsapp"></i>
                                <span>WhatsApp Order</span>
                                <small>Order via WhatsApp</small>
                            </button>
                            <button class="payment-option" onclick="store.processOrder('cash')">
                                <i class="fas fa-money-bill"></i>
                                <span>Cash on Delivery</span>
                                <small>Pay when delivered</small>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    processOrder(paymentMethod) {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create order
        const order = {
            id: Date.now(),
            items: [...this.cart],
            total: total,
            paymentMethod: paymentMethod,
            status: 'pending',
            timestamp: new Date().toISOString(),
            customerInfo: this.getCustomerInfo()
        };

        this.orders.push(order);
        localStorage.setItem('zuvani_orders', JSON.stringify(this.orders));

        // Process based on payment method
        switch(paymentMethod) {
            case 'mpesa':
                this.processMpesaPayment(total, order.id);
                break;
            case 'whatsapp':
                this.processWhatsAppOrder(total, order.id);
                break;
            case 'cash':
                this.processCashOnDelivery(total, order.id);
                break;
        }

        // Close modal
        document.querySelector('.modal')?.remove();
    }

    processMpesaPayment(total, orderId) {
        const phone = prompt('Enter your M-Pesa phone number (e.g., 07XXXXXXXX):');
        if (phone && phone.length === 10) {
            // Simulate M-Pesa payment processing
            this.showNotification('📱 M-Pesa payment request sent!', 'success');
            
            setTimeout(() => {
                this.completeOrder(orderId, phone);
                this.showNotification(`✅ Payment confirmed! Order #${orderId} received. We'll deliver soon!`, 'success');
            }, 3000);
        } else {
            this.showNotification('Please enter a valid phone number', 'error');
        }
    }

    processWhatsAppOrder(total, orderId) {
        const orderSummary = this.cart.map(item => 
            `${item.name} (${item.selectedSize}, ${item.selectedColor}) x${item.quantity} - KSh ${item.price * item.quantity}`
        ).join('%0A');

        const message = `Hello Zuvani! I want to order:%0A%0A${orderSummary}%0A%0ATotal: KSh ${total}%0AOrder ID: ${orderId}%0A%0APlease confirm my order.`;
        
        window.open(`https://wa.me/254758619460?text=${message}`, '_blank');
        this.completeOrder(orderId, 'whatsapp');
        this.showNotification('📱 Order sent via WhatsApp! We\'ll confirm shortly.', 'success');
    }

    processCashOnDelivery(total, orderId) {
        const address = prompt('Please enter your delivery address:');
        if (address) {
            this.completeOrder(orderId, 'cash', address);
            this.showNotification(`✅ Order #${orderId} confirmed! We'll deliver to: ${address}`, 'success');
        }
    }

    completeOrder(orderId, paymentMethod, address = '') {
        // Update stock
        this.cart.forEach(cartItem => {
            const product = this.products.find(p => p.id === cartItem.id);
            if (product) {
                product.stock -= cartItem.quantity;
                if (product.stock === 0) {
                    product.status = 'sold';
                }
            }
        });

        // Save changes
        this.saveProducts();
        
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.displayProducts();

        // Close cart
        this.closeCart();

        // Add activity
        this.addActivity(`New order #${orderId} received via ${paymentMethod}`);
    }

    getCustomerInfo() {
        return {
            name: localStorage.getItem('zuvani_customer_name') || '',
            phone: localStorage.getItem('zuvani_customer_phone') || '',
            email: localStorage.getItem('zuvani_customer_email') || ''
        };
    }

    // ADMIN PASSWORD SYSTEM
    checkAdminPassword(inputPassword) {
        return inputPassword === this.adminPassword;
    }

    changeAdminPassword(oldPassword, newPassword) {
        if (this.checkAdminPassword(oldPassword)) {
            this.adminPassword = newPassword;
            localStorage.setItem('zuvani_admin_password', newPassword);
            return true;
        }
        return false;
    }

    // BUSINESS INFO
    updateBusinessInfo() {
        // Update contact information throughout the site
        const elements = {
            'store-phone': this.businessSettings.phone,
            'store-email': this.businessSettings.email,
            'store-location': this.businessSettings.location
        };

        Object.entries(elements).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // CART UI
    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        sidebar?.classList.toggle('active');
    }

    closeCart() {
        const sidebar = document.getElementById('cart-sidebar');
        sidebar?.classList.remove('active');
    }

    // UTILITIES
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--${type}-color);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-color);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    addActivity(message) {
        const activities = JSON.parse(localStorage.getItem('zuvani_activities')) || [];
        activities.unshift({
            message: message,
            timestamp: new Date().toISOString(),
            type: 'info'
        });
        localStorage.setItem('zuvani_activities', JSON.stringify(activities));
    }

    filterProducts(category) {
        this.displayProducts('products-container', category);
    }
}

// Initialize store
const store = new ZuvaniStore();

// Global functions for HTML onclick
function addToCart(productId) {
    store.addToCart(productId);
}

function removeFromCart(productId) {
    store.removeFromCart(productId);
}

function updateQuantity(productId, change) {
    store.updateQuantity(productId, change);
}

function toggleCart() {
    store.toggleCart();
}

function closeCart() {
    store.closeCart();
}

function checkout() {
    store.checkout();
}

function filterProducts(category) {
    store.filterProducts(category);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-state {
        text-align: center;
        padding: 3rem;
        color: var(--text-muted);
    }
    
    .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--accent-color);
    }
    
    .featured-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--accent-color);
        color: var(--primary-bg);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 700;
    }
    
    .cart-item-meta {
        display: flex;
        gap: 1rem;
        margin: 0.5rem 0;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: var(--error-color);
        cursor: pointer;
        font-size: 0.8rem;
        padding: 0;
    }
    
    .payment-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .payment-option {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        padding: 1.5rem;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
    }
    
    .payment-option:hover {
        border-color: var(--accent-color);
        transform: translateY(-2px);
    }
    
    .order-summary {
        margin-bottom: 2rem;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .order-total {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
        border-top: 2px solid var(--border-color);
        margin-top: 1rem;
    }
`;
document.head.appendChild(style);