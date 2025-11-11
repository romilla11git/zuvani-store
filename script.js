// ZUVANI TEES - SIMPLE & WORKING
class ZuvaniStore {
    constructor() {
        this.products = [
            {
                id: 1,
                name: "Classic Round Neck Tee",
                price: 1200,
                description: "Premium cotton t-shirt with Zuvani print",
                image: "Classic Tee"
            },
            {
                id: 2,
                name: "Premium Polo Shirt",
                price: 1500,
                description: "Quality polo shirt for casual wear",
                image: "Polo Shirt"
            },
            {
                id: 3,
                name: "Urban Hoodie",
                price: 2500,
                description: "Comfortable hoodie for street style",
                image: "Hoodie"
            }
        ];
        
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.adminPassword = "zuvani2025";
        
        this.init();
    }

    init() {
        this.displayProducts();
        this.updateCartCount();
    }

    displayProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <p class="product-price">KSh ${product.price}</p>
                <button class="btn btn-gold" onclick="store.addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            this.cart.push(product);
            localStorage.setItem('cart', JSON.stringify(this.cart));
            this.updateCartCount();
            alert('✅ Added to cart!');
        }
    }

    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = this.cart.length;
        }
    }

    // ADMIN FUNCTIONS
    checkAdminPassword(password) {
        return password === this.adminPassword;
    }
}

// Initialize store
const store = new ZuvaniStore();
