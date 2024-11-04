const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter for Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anjaniguptasde@gmail.com', // Your email
        pass: 'pouv adaj psxv wfjg', // Your app password
    },
});

router.get('/:id', async (req, res) => {
    try {
        const users = await User.findById(req.params.id);
        if (!users) {
            console.error("User not found with ID:", req.params.id);
            return res.status(404).json({ message: "User not found" });
        }
        res.json(users);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
});


// Function to send deletion notification email
async function sendDeletionEmail(user) {
    const mailOptions = {
        from: `Pustak Pathsala <anjaniguptasde@gmail.com>`,
        to: user.email,
        subject: 'Account Deletion Notification',
        text: `Dear ${user.name},\n\nYour account has been deleted for security purposes. Thank you for your interest in Pustak Pathsala. If you wish to join us again, please create a new account with valid identity verification.\n\nRegards,\nPustak Pathsala Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Deletion email sent successfully to:', user.email);
    } catch (error) {
        console.error('Error sending email:', error.response || error.message);
    }
}

// Sign up route for users
router.post('/signup', async (req, res) => {
    const { name, email, contact, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, contact, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route for users
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Existing route to fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Example Express route for searching users
router.get('/search', async (req, res) => {
    const { name } = req.query;
    try {
        const users = await User.find({ name: { $regex: name, $options: 'i' } }); // 'i' for case-insensitive
        console.log('Search Results:', books); // Debugging
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await sendDeletionEmail(user);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

module.exports = router;
