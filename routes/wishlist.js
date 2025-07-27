const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// Default user ID (for simplicity)
const DEFAULT_USER_ID = '60d0fe4f5311236168a109ca';

// Get user's wishlist
router.get('/', async (req, res) => {
    try {
        let user = await User.findById(DEFAULT_USER_ID).populate('wishlist.book');
        
        // If user doesn't exist, create one
        if (!user) {
            user = new User({ _id: mongoose.Types.ObjectId(DEFAULT_USER_ID) });
            await user.save();
            return res.json({ items: [] });
        }
        
        res.json({ items: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add book to wishlist
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
        
        // Check if book is already in wishlist
        const isBookInWishlist = user.wishlist.some(item => item.book.equals(bookId));
        if (isBookInWishlist) {
            return res.status(400).json({ message: 'Book already in wishlist' });
        }
        
        // Add book to wishlist
        user.wishlist.push({ book: bookId });
        await user.save();
        
        res.status(201).json({ message: 'Book added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove book from wishlist
router.delete('/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        
        // Find user
        const user = await User.findById(DEFAULT_USER_ID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove book from wishlist
        user.wishlist = user.wishlist.filter(item => !item.book.equals(bookId));
        await user.save();
        
        res.json({ message: 'Book removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
