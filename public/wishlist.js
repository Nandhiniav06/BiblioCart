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

// Fetch wishlist items
async function fetchWishlist() {
    try {
        // Show loading state
        const wishlistContainer = document.getElementById('wishlist-items');
        wishlistContainer.innerHTML = `
            <div class="col-12 loading-spinner">
                <i class="fas fa-spinner"></i>
            </div>
        `;
        
        const response = await fetch(`${API_URL}/wishlist`);
        const wishlistData = await response.json();
        displayWishlistItems(wishlistData);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        document.getElementById('wishlist-items').innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    Failed to load wishlist. Please try again later.
                </div>
            </div>
        `;
    }
}

// Display wishlist items
function displayWishlistItems(wishlistData) {
    const wishlistContainer = document.getElementById('wishlist-items');
    wishlistContainer.innerHTML = '';
    
    if (wishlistData.items.length === 0) {
        const emptyTemplate = document.getElementById('empty-wishlist-template');
        wishlistContainer.innerHTML = emptyTemplate.innerHTML;
        return;
    }
    
    wishlistData.items.forEach(item => {
        const book = item.book;
        // Generate random rating between 3 and 5
        const rating = (Math.random() * 2 + 3).toFixed(1);
        
        const itemCard = document.createElement('div');
        itemCard.className = 'col-sm-6 col-md-4 col-lg-3';
        itemCard.innerHTML = `
            <div class="card book-card">
                <div class="book-card-img-container">
                    <img src="${book.coverImage}" class="card-img-top book-image" alt="${book.title}">
                    <div class="book-actions">
                        <button class="book-action-btn" onclick="removeFromWishlist('${book._id}')">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button class="book-action-btn" onclick="moveToCart('${book._id}')">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="book-author">By ${book.author}</p>
                    <div class="book-rating">
                        ${generateStarRating(rating)}
                        <span class="ms-1">(${rating})</span>
                    </div>
                    <p class="price">USD ${book.price.toFixed(2)}</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-sm btn-danger" onclick="removeFromWishlist('${book._id}')">
                            <i class="fas fa-trash-alt me-1"></i> Remove
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="moveToCart('${book._id}')">
                            <i class="fas fa-shopping-cart me-1"></i> Move to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
        wishlistContainer.appendChild(itemCard);
    });
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Remove book from wishlist
async function removeFromWishlist(bookId) {
    try {
        const response = await fetch(`${API_URL}/wishlist/${bookId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            showToast('Book removed from wishlist', 'success');
            fetchWishlist(); // Refresh the wishlist
        } else {
            const error = await response.json();
            showToast(`${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showToast('Failed to remove book from wishlist', 'error');
    }
}

// Move book from wishlist to cart
async function moveToCart(bookId) {
    try {
        // Add to cart
        const addResponse = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        });
        
        if (addResponse.ok) {
            // Remove from wishlist
            const removeResponse = await fetch(`${API_URL}/wishlist/${bookId}`, {
                method: 'DELETE',
            });
            
            if (removeResponse.ok) {
                showToast('Book moved to cart!', 'success');
                fetchWishlist(); // Refresh the wishlist
            }
        } else {
            const error = await addResponse.json();
            showToast(`${error.message}`, 'error');
        }
    } catch (error) {
        console.error('Error moving to cart:', error);
        showToast('Failed to move book to cart', 'error');
    }
}

// Load wishlist when page loads
document.addEventListener('DOMContentLoaded', fetchWishlist);
