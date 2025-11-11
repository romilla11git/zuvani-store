// SIMPLE WORKING STORE
class ZuvaniStore {
    constructor() {
        this.adminPassword = 'zuvani2025';
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
                description: "Premium cotton t-shirt",
                stock: 10
            },
            {
                id: 2,
                name: "Premium Polo Shirt",
                price: 1500, 
                description: "Quality polo shirt",
                stock: 8
            }
        ];
    }

    init() {
        this.displayProducts();
        this.updateCartCount();
    }

    checkAdminPassword(password) {
        return password === 'zuvani2025';
    }

    displayProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.name}</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">KSh ${product.price}</p>
                    <button class="cta-button" onclick="store.addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.cart.push({...product, quantity: 1});
        localStorage.setItem('zuvani_cart', JSON.stringify(this.cart));
        this.updateCartCount();
        alert('Added to cart!');
    }

    updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            countElement.textContent = this.cart.length;
        }
    }
}

const store = new ZuvaniStore();
