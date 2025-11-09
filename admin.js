// ===== ZUVANI TEES - ADMIN FUNCTIONALITY =====
class ZuvaniAdmin {
    constructor() {
        if (!localStorage.getItem('zuvani_admin_authenticated')) {
            window.location.href = 'admin-login.html';
            return;
        }
        
        this.store = new ZuvaniStore();
        this.init();
    }

    init() {
        this.displayDashboard();
        this.displayAdminProducts();
        this.displayOrders();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        // Add product form
        document.getElementById('add-product-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Business settings form
        document.getElementById('business-settings-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBusinessSettings();
        });
    }

    // DASHBOARD
    displayDashboard() {
        this.updateStats();
        this.displayRecentActivity();
    }

    updateStats() {
        const stats = {
            'total-products': this.store.products.length,
            'total-orders': this.store.orders.length,
            'total-customers': this.store.customers.length,
            'total-revenue': this.store.orders.reduce((sum, order) => sum + order.total, 0)
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'total-revenue') {
                    element.textContent = `KSh ${value.toLocaleString()}`;
                } else {
                    element.textContent = value.toLocaleString();
                }
            }
        });
    }

    displayRecentActivity() {
        const activities = JSON.parse(localStorage.getItem('zuvani_activities')) || [];
        const container = document.getElementById('activity-list');
        
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <i class="fas fa-info-circle"></i>
                    <span>No recent activity. Activities will appear here as customers interact with your store.</span>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                <span>${activity.message}</span>
                <small>${new Date(activity.timestamp).toLocaleDateString()}</small>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            info: 'info-circle',
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'exclamation-circle'
        };
        return icons[type] || 'info-circle';
    }

    // PRODUCT MANAGEMENT
    addProduct() {
        const name = document.getElementById('product-name').value.trim();
        const price = parseInt(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const stock = parseInt(document.getElementById('product-stock').value);
        const description = document.getElementById('product-description').value.trim();
        const image = document.getElementById('product-image').value.trim();

        if (!name || !price || !category || !stock || !description) {
            this.showAdminMessage('Please fill all required fields', 'error');
            return;
        }

        if (price <= 0 || stock < 0) {
            this.showAdminMessage('Price and stock must be positive numbers', 'error');
            return;
        }

        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            stock,
            description,
            image: image || 'images/product.jpg',
            status: stock > 0 ? 'available' : 'sold',
            sizes: ["S", "M", "L", "XL"],
            colors: ["Black", "White", "Navy"],
            featured: false,
            createdAt: new Date().toISOString()
        };

        this.store.products.push(newProduct);
        this.store.saveProducts();
        this.store.displayProducts();
        this.displayAdminProducts();
        this.updateStats();

        document.getElementById('add-product-form').reset();
        this.showAdminMessage('✅ Product added successfully!', 'success');
        this.store.addActivity(`New product added: ${name}`);
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            this.store.products = this.store.products.filter(p => p.id !== productId);
            this.store.saveProducts();
            this.store.displayProducts();
            this.displayAdminProducts();
            this.updateStats();
            this.showAdminMessage('Product deleted successfully!', 'success');
            this.store.addActivity(`Product deleted: ID ${productId}`);
        }
    }

    updateProductStock(productId, newStock) {
        const product = this.store.products.find(p => p.id === productId);
        if (product) {
            const oldStock = product.stock;
            product.stock = parseInt(newStock);
            product.status = newStock > 0 ? 'available' : 'sold';
            this.store.saveProducts();
            this.store.displayProducts();
            this.displayAdminProducts();
            
            if (oldStock !== product.stock) {
                this.store.addActivity(`Stock updated for ${product.name}: ${oldStock} → ${newStock}`);
            }
        }
    }

    toggleProductFeatured(productId) {
        const product = this.store.products.find(p => p.id === productId);
        if (product) {
            product.featured = !product.featured;
            this.store.saveProducts();
            this.store.displayProducts();
            this.displayAdminProducts();
            this.showAdminMessage(`Product ${product.featured ? 'added to' : 'removed from'} featured items`, 'success');
        }
    }

    displayAdminProducts() {
        const container = document.getElementById('admin-products-list');
        if (!container) return;

        if (this.store.products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tshirt"></i>
                    <h4>No products yet</h4>
                    <p>Add your first product using the form above to get started!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.store.products.map(product => `
            <div class="admin-product-card">
                <div class="product-header">
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <div class="product-meta">
                            <span class="product-category">${product.category}</span>
                            <span class="product-id">ID: ${product.id}</span>
                            <span class="status-${product.status}">${product.status}</span>
                            ${product.featured ? '<span class="featured-tag">⭐ Featured</span>' : ''}
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="action-btn featured-btn" onclick="admin.toggleProductFeatured(${product.id})" 
                                title="${product.featured ? 'Remove from featured' : 'Add to featured'}">
                            <i class="fas ${product.featured ? 'fa-star' : 'fa-star'}"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="admin.deleteProduct(${product.id})" title="Delete product">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-details">
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-specs">
                        <div class="spec-item">
                            <strong>Price:</strong> KSh ${product.price.toLocaleString()}
                        </div>
                        <div class="spec-item">
                            <strong>Stock:</strong> 
                            <input type="number" value="${product.stock}" 
                                   onchange="admin.updateProductStock(${product.id}, this.value)"
                                   class="stock-input">
                        </div>
                        <div class="spec-item">
                            <strong>Sizes:</strong> ${product.sizes?.join(', ') || 'One Size'}
                        </div>
                        <div class="spec-item">
                            <strong>Colors:</strong> ${product.colors?.join(', ') || 'Various'}
                        </div>
                    </div>
                    
                    <div class="product-image-info">
                        <small><strong>Image Path:</strong> ${product.image}</small>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ORDER MANAGEMENT
    displayOrders() {
        const container = document.getElementById('orders-list');
        if (!container) return;

        if (this.store.orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h4>No orders yet</h4>
                    <p>Orders will appear here when customers make purchases from your store.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.store.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order #${order.id}</h4>
                        <div class="order-meta">
                            <span class="order-date">${new Date(order.timestamp).toLocaleDateString()}</span>
                            <span class="order-payment">${order.paymentMethod.toUpperCase()}</span>
                            <span class="order-status status-${order.status}">${order.status}</span>
                        </div>
                    </div>
                    <div class="order-total">
                        KSh ${order.total.toLocaleString()}
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} (${item.selectedSize}, ${item.selectedColor})</span>
                            <span>x${item.quantity}</span>
                            <span>KSh ${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-actions">
                    <button class="action-btn" onclick="admin.updateOrderStatus(${order.id}, 'processing')">
                        <i class="fas fa-cog"></i> Process
                    </button>
                    <button class="action-btn" onclick="admin.updateOrderStatus(${order.id}, 'completed')">
                        <i class="fas fa-check"></i> Complete
                    </button>
                    <button class="action-btn" onclick="admin.viewOrderDetails(${order.id})">
                        <i class="fas fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateOrderStatus(orderId, status) {
        const order = this.store.orders.find(o => o.id === orderId);
        if (order) {
            const oldStatus = order.status;
            order.status = status;
            localStorage.setItem('zuvani_orders', JSON.stringify(this.store.orders));
            this.displayOrders();
            this.updateStats();
            this.showAdminMessage(`Order #${orderId} status updated: ${oldStatus} → ${status}`, 'success');
            this.store.addActivity(`Order #${orderId} status changed to ${status}`);
        }
    }

    viewOrderDetails(orderId) {
        const order = this.store.orders.find(o => o.id === orderId);
        if (order) {
            alert(`Order #${orderId} Details:\n\n` +
                  `Items: ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}\n` +
                  `Total: KSh ${order.total.toLocaleString()}\n` +
                  `Payment: ${order.paymentMethod}\n` +
                  `Status: ${order.status}\n` +
                  `Date: ${new Date(order.timestamp).toLocaleString()}`);
        }
    }

    // BUSINESS SETTINGS
    saveBusinessSettings() {
        const settings = {
            storeName: document.getElementById('store-name').value,
            phone: document.getElementById('store-phone').value,
            email: document.getElementById('store-email').value,
            location: document.getElementById('store-location').value,
            description: document.getElementById('store-description').value
        };

        this.store.businessSettings = { ...this.store.businessSettings, ...settings };
        localStorage.setItem('zuvani_business_settings', JSON.stringify(this.store.businessSettings));
        
        this.store.updateBusinessInfo();
        this.showAdminMessage('Business settings saved successfully!', 'success');
        this.store.addActivity('Business settings updated');
    }

    // UTILITIES
    showAdminMessage(message, type = 'info') {
        // This would be implemented to show messages in the admin interface
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // You can implement a proper notification system here
        const notification = document.createElement('div');
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
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize admin
const admin = new ZuvaniAdmin();

// Add admin-specific CSS
const adminStyles = `
    .admin-product-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .product-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    
    .product-meta {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }
    
    .product-category, .product-id, .featured-tag {
        background: var(--secondary-bg);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
    }
    
    .featured-tag {
        background: var(--accent-color);
        color: var(--primary-bg);
    }
    
    .product-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .action-btn {
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .action-btn:hover {
        border-color: var(--accent-color);
        transform: translateY(-1px);
    }
    
    .featured-btn {
        color: var(--accent-color);
    }
    
    .delete-btn {
        color: var(--error-color);
    }
    
    .product-specs {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .spec-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .stock-input {
        width: 80px;
        padding: 4px 8px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-primary);
    }
    
    .order-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .order-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }
    
    .order-meta {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        flex-wrap: wrap;
    }
    
    .order-date, .order-payment {
        background: var(--secondary-bg);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
    }
    
    .order-items {
        margin: 1rem 0;
    }
    
    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .order-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);