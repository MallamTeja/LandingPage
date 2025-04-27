const mongoose = require('mongoose');

// Database connection URI - replace with your actual MongoDB URI or use environment variable
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/to_clarity_db';

// Connect to MongoDB
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Uncomment for mongoose versions < 6.0
    // useFindAndModify: false, // Uncomment for mongoose versions < 6.0
})
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit process with failure
    });

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Handle application termination and close DB connection properly
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to application termination');
    process.exit(0);
});

module.exports = mongoose;