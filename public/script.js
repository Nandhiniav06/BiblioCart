const API_URL = 'http://localhost:3000/api';

// Toast notification system
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon} toast-icon ${type}"></i>
        <div class="toast-content">${message}</div>
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

// Update cart count
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Fetch all books from the server
async function fetchBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);
        const books = await response.json();
        displayBooks(books);
        
        // Update cart count
        fetchCartCount();
    } catch (error) {
        console.error('Error fetching books:', error);
        document.getElementById('book-list').innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    Failed to load books. Please try again later.
                </div>
            </div>
        `;
    }
}

// Fetch cart count
async function fetchCartCount() {
    try {
        const response = await fetch(`${API_URL}/cart`);
        const cartData = await response.json();
        updateCartCount(cartData.items.length);
    } catch (error) {
        console.error('Error fetching cart count:', error);
    }
}

// Display books on the page
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    
    books.forEach(book => {
        // Create a random rating between 3 and 5
        const rating = (Math.random() * 2 + 3).toFixed(1);
        
        const bookCol = document.createElement('div');
        bookCol.className = 'col-lg-2 col-md-3 col-sm-4 col-6';
        
        bookCol.innerHTML = `
            <div class="book-item">
                <div class="book-cover">
                    <img src="${book.coverImage}" alt="${book.title}">
                    <div class="book-actions">
                        <button class="btn-circle" onclick="addToWishlist('${book._id}')">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="btn-circle" onclick="addToCart('${book._id}')">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button class="btn-circle">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-rating">
                    <div class="stars">${generateStarRating(rating)}</div>
                    <span class="rating-count">(${rating})</span>
                </div>
                <div class="book-price">USD ${book.price.toFixed(2)}</div>
            </div>
        `;
        
        bookList.appendChild(bookCol);
    });
}

// Add book to wishlist
async function addToWishlist(bookId) {
    try {
        const response = await fetch(`${API_URL}/wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        });
        
        if (response.ok) {
            showToast('Book added to wishlist!');
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showToast('Failed to add book to wishlist', 'error');
    }
}

// Add book to cart
async function addToCart(bookId) {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        });
        
        if (response.ok) {
            showToast('Book added to cart!');
            // Update cart count
            fetchCartCount();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add book to cart', 'error');
    }
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Load books
    fetchBooks();
});
