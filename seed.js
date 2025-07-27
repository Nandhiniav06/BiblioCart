const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://bookstoreapp:123@bookstorecluster.jo1zigi.mongodb.net/bookstore?retryWrites=true&w=majority&appName=BookstoreCluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas for seeding'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Sample books data
const books = [
    {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        price: 12.99,
        coverImage: 'https://via.placeholder.com/150x200?text=To+Kill+a+Mockingbird',
        description: 'A classic novel about racial injustice in the American South.'
    },
    {
        title: '1984',
        author: 'George Orwell',
        price: 10.99,
        coverImage: 'https://via.placeholder.com/150x200?text=1984',
        description: 'A dystopian novel about totalitarianism and surveillance.'
    },
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        price: 9.99,
        coverImage: 'https://via.placeholder.com/150x200?text=The+Great+Gatsby',
        description: 'A novel about wealth, excess, and the American Dream.'
    },
    {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        price: 8.99,
        coverImage: 'https://via.placeholder.com/150x200?text=Pride+and+Prejudice',
        description: 'A romantic novel about societal expectations and love.'
    },
    {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        price: 14.99,
        coverImage: 'https://via.placeholder.com/150x200?text=The+Hobbit',
        description: 'A fantasy novel about a hobbit who goes on an adventure.'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        price: 15.99,
        coverImage: 'https://via.placeholder.com/150x200?text=Harry+Potter',
        description: 'The first book in the Harry Potter series.'
    }
];

// Seed the database
async function seedDatabase() {
    try {
        // Clear existing data
        await Book.deleteMany({});
        await User.deleteMany({});
        
        // Insert books
        const insertedBooks = await Book.insertMany(books);
        console.log(`${insertedBooks.length} books inserted`);
        
        // Create default user
        const user = new User({
            _id: '60d0fe4f5311236168a109ca',
            name: 'Default User',
            email: 'user@example.com'
        });
        await user.save();
        console.log('Default user created');
        
        console.log('Database seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
}

seedDatabase();
