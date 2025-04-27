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
        
        console.log('Received user data:', { username, email, firstName, lastName });

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
        
        console.log('User saved:', savedUser);

        res.status(201).json({
            message: 'User created successfully',
            user: savedUser
        });
    } catch (error) {
        // Handle duplicate key errors
        if (error.code === 11000) {
            console.log('Duplicate user error:', error);
            return res.status(400).json({ 
                message: 'User already exists with that username or email' 
            });
        }
        
        console.error('Error creating user:', error);
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

const bcrypt = require('bcrypt');

// Additional routes can be added here

// POST /login - authenticate user
router.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ message: 'Username/email and password are required' });
        }

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username/email or password' });
        }

        // Authentication successful
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// POST /records - create a new record
const Record = require('../models/Record');

router.post('/records', async (req, res) => {
    try {
        const { name, email, phone, category } = req.body;

        console.log('Received record data:', { name, email, phone, category });

        if (!name || !category) {
            console.log('Validation failed: Name and category are required');
            return res.status(400).json({ message: 'Name and category are required' });
        }

        // Create new record
        const newRecord = new Record({
            name,
            email: email || undefined, // set undefined if not provided
            phone: phone || '',
            category
        });

        const savedRecord = await newRecord.save();

        console.log('Record saved:', savedRecord);

        res.status(201).json({
            message: 'Record created successfully',
            record: savedRecord
        });
    } catch (error) {
        console.error('Error creating record:', error);
        let errorMessage = 'Error creating record';
        if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors).map(e => e.message).join('; ');
        } else if (error.message) {
            errorMessage = error.message;
        }
        res.status(500).json({
            message: errorMessage,
            error: error
        });
    }
});

module.exports = router;
