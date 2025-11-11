// Product Data
const products = [
    {
        id: 1,
        name: "Classic White Shirt",
        price: 49.99,
        category: "shirts",
        featured: true
    },
    {
        id: 2,
        name: "Denim Jacket",
        price: 79.99,
        category: "jackets",
        featured: true
    },
    {
        id: 3,
        name: "Summer Dress",
        price: 59.99,
        category: "dresses",
        featured: true
    },
    {
        id: 4,
        name: "Leather Boots",
        price: 129.99,
        category: "shoes",
        featured: false
    },
    {
        id: 5,
        name: "Casual Trousers",
        price: 39.99,
        category: "pants",
        featured: false
    },
    {
        id: 6,
        name: "Winter Coat",
        price: 149.99,
        category: "jackets",
        featured: false
    },
    {
        id: 7,
        name: "Silk Blouse",
        price: 69.99,
        category: "shirts",
        featured: false
    },
    {
        id: 8,
        name: "Sneakers",
        price: 89.99,
        category: "shoes",
        featured: false
    }
];

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    // Load products
    loadFeaturedProducts();
    loadAllProducts();
    
    // Navigation event listeners
    navLinks.forEach(link => {
        if (!link.getAttribute('href').includes('admin.html')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                showPage(targetPage);
                
                // Update active nav link
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                link.classList.add('active');
            });
        }
    });

    // Shop Now button
    document.querySelector('.shop-now').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('shop');
    });

    // Contact form submission
    document.querySelector('.contact-form .btn').addEventListener('click', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            alert('Thank you for your message! We will get back to you soon.');
            document.querySelector('.contact-form').reset();
        } else {
            alert('Please fill in all fields.');
        }
    });

    // Complete payment button
    document.querySelector('.complete-payment').addEventListener('click', function() {
        const selectedMethod = document.querySelector('.payment-method.selected');
        if (!selectedMethod) {
            alert('Please select a payment method.');
            return;
        }

        if (selectedMethod.dataset.method === 'mpesa') {
            const phoneNumber = document.getElementById('phone-number').value;
            if (!phoneNumber) {
                alert('Please enter your phone number for M-Pesa payment.');
                return;
            }
        }

        alert('Payment completed successfully! Thank you for your order.');
        // Clear cart
        cart.length = 0;
        updateCart();
        showPage('home');
    });
});

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    const featuredProducts = products.filter(product => product.featured);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-img">Product Image</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" 
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to new buttons
    document.querySelectorAll('#featured-products .add-to-cart').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
}

function loadAllProducts() {
    const allProductsContainer = document.getElementById('all-products');
    
    allProductsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">Product Image</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" 
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to new buttons
    document.querySelectorAll('#all-products .add-to-cart').forEach(button => {
        button.addEventListener('click', addToCartHandler);
    });
}

function addToCartHandler() {
    const id = this.getAttribute('data-id');
    const name = this.getAttribute('data-name');
    const price = parseFloat(this.getAttribute('data-price'));
    
    addToCart(id, name, price);
}
