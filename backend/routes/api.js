const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all data (example endpoint)
router.get('/data', async (req, res) => {
    try {
        res.json({ 
            message: 'Data retrieved successfully',
            data: [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
                { id: 3, name: 'Item 3' }
            ]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error: error.message });
    }
});

// User routes
router.post('/users', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        
        // Create new user
        const newUser = new User({
            username,
            email,
            password, // Will be hashed by the pre-save middleware
            firstName,
            lastName
        });
        
        // Save user to database
        const savedUser = await newUser.save();
        
        // Don't return the password in the response
        savedUser.password = undefined;
        
        res.status(201).json({
            message: 'User created successfully',
            user: savedUser
        });
    } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'User already exists with that username or email' 
            });
        }
        
        res.status(500).json({ 
            message: 'Error creating user', 
            error: error.message 
        });
    }
});

// GET user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error retrieving user', 
            error: error.message 
        });
    }
});

// Additional routes can be added here

module.exports = router;