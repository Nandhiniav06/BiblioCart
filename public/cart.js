const API_URL = 'http://localhost:3000/api';

// Toast notification system
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon} toast-icon ${type}"></i>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fetch cart items
async function fetchCart() {
    try {
        // Show loading state
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const cartContainer = document.getElementById('cart-container');
        
        cartItems.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner"></i>
            </div>
        `;
        
        cartSummary.innerHTML = '';
        
        const response = await fetch(`${API_URL}/cart`);
        const cartData = await response.json();
        
        if (cartData.items.length === 0) {
            const emptyTemplate = document.getElementById('empty-cart-template');
            cartContainer.innerHTML = emptyTemplate.innerHTML;
            return;
        }
        
        displayCartItems(cartData);
        displayCartSummary(cartData);
    } catch (error) {
        console.error('Error fetching cart:', error);
        document.getElementById('cart-items').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Failed to load cart. Please try again later.
            </div>
        `;
    }
}

// Display cart items
function displayCartItems(cartData) {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    
    cartData.items.forEach(item => {
        const book = item.book;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${book.coverImage}" class="cart-item-image" alt="${book.title}">
            <div class="cart-item-details">
                <h5 class="cart-item-title">${book.title}</h5>
                <p class="cart-item-author">By ${book.author}</p>
                <p class="cart-item-price">USD ${book.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${book._id}')">
                        <i class="fas fa-trash-alt me-1"></i> Remove
                    </button>
                    <button class="btn btn-sm btn-outline-primary" onclick="moveToWishlist('${book._id}')">
                        <i class="fas fa-heart me-1"></i> Save for Later
                    </button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
}

// Display cart summary
function displayCartSummary(cartData) {
    const cartSummary = document.getElementById('cart-summary');
    let subtotal = 0;
    let shipping = 0;
    let tax = 0;
    
    cartData.items.forEach(item => {
        subtotal += item.book.price;
    });
    
    // Calculate shipping and tax
    shipping = subtotal > 35 ? 0 : 5.99;
    tax = subtotal * 0.08; // 8% tax
    
    const total = subtotal + shipping + tax;
    
    cartSummary.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-item">
            <span>Subtotal (${cartData.items.length} items)</span>
            <span>USD ${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Shipping</span>
            <span>${shipping === 0 ? 'Free' : 'USD ' + shipping.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Estimated Tax</span>
            <span>USD ${tax.toFixed(2)}</span>
        </div>
        <div class="summary-item summary-total">
            <span>Total</span>
            <span>USD ${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-success checkout-btn">
            <i class="fas fa-lock me-2"></i> Proceed to Checkout
        </button>
    `;
}

// Remove book from cart
async function removeFromCart(bookId) {
    try {
        const response = await fetch(`${API_URL}/cart/${bookId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            showToast('Book removed from cart', 'success');
            fetchCart(); // Refresh the cart
        } else {
            const error = await response.json();
            showToast(`${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        showToast('Failed to remove book from cart', 'error');
    }
}

// Move book from cart to wishlist
async function moveToWishlist(bookId) {
    try {
        // Add to wishlist
        const addResponse = await fetch(`${API_URL}/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        });
        
        if (addResponse.ok) {
            // Remove from cart
            const removeResponse = await fetch(`${API_URL}/cart/${bookId}`, {
                method: 'DELETE',
            });
            
            if (removeResponse.ok) {
                showToast('Book moved to wishlist!', 'success');
                fetchCart(); // Refresh the cart
            }
        } else {
            const error = await addResponse.json();
            showToast(`${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error moving to wishlist:', error);
        showToast('Failed to move book to wishlist', 'error');
    }
}

// Load cart when page loads
document.addEventListener('DOMContentLoaded', fetchCart);
