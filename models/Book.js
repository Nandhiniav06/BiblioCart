const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    coverImage: {
        type: String,
        default: 'https://via.placeholder.com/150x200?text=Book+Cover'
    },
    description: {
        type: String,
        default: 'No description available.'
    }
});

module.exports = mongoose.model('Book', bookSchema);
