const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Default User'
    },
    email: {
        type: String,
        default: 'user@example.com'
    },
    wishlist: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    cart: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        quantity: {
            type: Number,
            default: 1
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('User', userSchema);
