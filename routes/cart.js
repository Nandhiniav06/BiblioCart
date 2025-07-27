const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// Default user ID (for simplicity)
const DEFAULT_USER_ID = '60d0fe4f5311236168a109ca';

// Get user's cart
router.get('/', async (req, res) => {
    try {
        let user = await User.findById(DEFAULT_USER_ID).populate('cart.book');
        
        // If user doesn't exist, create one
        if (!user) {
            user = new User({ _id: mongoose.Types.ObjectId(DEFAULT_USER_ID) });
            await user.save();
            return res.json({ items: [] });
        }
        
        res.json({ items: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add book to cart
router.post('/', async (req, res) => {
    try {
        const { bookId } = req.body;
        
        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        // Find user or create if not exists
        let user = await User.findById(DEFAULT_USER_ID);
        if (!user) {
            user = new User({ _id: mongoose.Types.ObjectId(DEFAULT_USER_ID) });
        }
        
        // Check if book is already in cart
        const existingCartItem = user.cart.find(item => item.book.equals(bookId));
        if (existingCartItem) {
            // Increment quantity if already in cart
            existingCartItem.quantity += 1;
        } else {
            // Add new book to cart
            user.cart.push({ book: bookId, quantity: 1 });
        }
        
        await user.save();
        
        res.status(201).json({ message: 'Book added to cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove book from cart
router.delete('/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        
        // Find user
        const user = await User.findById(DEFAULT_USER_ID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove book from cart
        user.cart = user.cart.filter(item => !item.book.equals(bookId));
        await user.save();
        
        res.json({ message: 'Book removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
