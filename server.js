const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const bookRoutes = require('./routes/books');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas
mongoose.connect('MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookstore?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

// Serve static frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/wishlist.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'wishlist.html'));
});

app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cart.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
