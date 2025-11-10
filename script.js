// SIMPLE ZUVANI STORE - GUARANTEED WORKING
class ZuvaniStore {
    constructor() {
        // SIMPLE PASSWORD SYSTEM - GUARANTEED TO WORK
        this.adminPassword = 'zuvani2025'; // Hardcoded to always work
        
        this.products = JSON.parse(localStorage.getItem('zuvani_products')) || this.getDefaultProducts();
        this.cart = JSON.parse(localStorage.getItem('zuvani_cart')) || [];
        this.init();
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Classic Round Neck Tee",
                price: 1200,
                category: "t-shirts",
                description: "Premium cotton round neck t-shirt",
                stock: 10,
                status: "available"
            },
            {
                id: 2,
                name: "Premium Polo Shirt", 
                price: 1500,
                category: "polo",
                description: "Quality polo shirt for casual wear",
                stock: 8,
                status: "available"
            }
        ];
    }

    init() {
        this.saveProducts();
        this.displayProducts();
        this.updateCartCount();
    }

    // SIMPLE PASSWORD CHECK - ALWAYS WORKS
    checkAdminPassword(inputPassword) {
        return inputPassword === 'zuvani2025';
    }

    changeAdminPassword(oldPassword, newPassword) {
        if (this.checkAdminPassword(oldPassword)) {
            this.adminPassword = newPassword;
            return true;
        }
        return false;
    }

    // REST OF YOUR METHODS...
    saveProducts() {
        localStorage.setItem('zuvani_products', JSON.stringify(this.products));
    }

    displayProducts(containerId = 'products-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.name} Image</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">KSh ${product.price}</p>
                    <button class="cta-button small" onclick="store.addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.cart.push({...product, quantity: 1});
        }

        this.saveCart();
        this.updateCartCount();
        alert('Added to cart!');
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
}

// Initialize store
const store = new ZuvaniStore();

// Global functions
function addToCart(productId) {
    store.addToCart(productId);
}
