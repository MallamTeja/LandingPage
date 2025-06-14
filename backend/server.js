
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

// Log mongoose connection events
db.connection.on('connected', () => {
    console.log('Mongoose connected to DB (from server.js)');
});
db.connection.on('error', (err) => {
    console.error('Mongoose connection error (from server.js):', err);
});
db.connection.on('disconnected', () => {
    console.log('Mongoose disconnected (from server.js)');
});

// Import routes
const apiRoutes = require('./routes/api');

// Initialize express application
const app = express();
const PORT = process.env.PORT || 3000;

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (if needed)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.use('/api', apiRoutes);

// Simple test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend server is running correctly!' });
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});