const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// Sign up route
router.post('/signup', async (req, res) => {
    const { name, email, contact, password } = req.body;

    try {
        // Check if the email is already taken
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin instance
        const newAdmin = new Admin({ name, email, contact, password: hashedPassword});
        await newAdmin.save();

        // Respond with success message
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Signup error:', error); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});


// In routes/bookRoutes.js
router.post('/issue-book', async (req, res) => {
    const { userId, bookId } = req.body;
  
    try {
      const book = await Book.findById(bookId);
  
      if (book && book.availableUnits > 0) {
        book.availableUnits -= 1;
        book.borrowedUnits += 1;
        await book.save();
  
        res.status(200).send({ message: 'Book issued successfully' });
      } else {
        res.status(400).send({ message: 'Book not available' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error issuing book', error });
    }
  });
  
// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, adminId: admin._id });
    } catch (error) {
        console.error('Login error:', error); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
