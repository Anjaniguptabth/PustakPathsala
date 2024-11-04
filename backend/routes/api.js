const express = require('express');
const {
    AdminSignup,
    AdminLogin
} = require('../controllers/auth.controller'); // Ensure these are defined and exported correctly
const {
    createBook,
    updateBook,
    deleteBook,
    getAllBooks
} = require('../controllers/book.controller'); // Ensure these are defined and exported correctly

const router = express.Router();

// Auth routes
router.post('/AdminSignup', AdminSignup); // Check this
router.post('/AdminLogin', AdminLogin); // Check this
router.post('/UserSignup', UserSignup); // Check this
router.post('/UserLogin', UserLogin); // Check this
// Book CRUD routes
router.post('/books', createBook); // Check this
router.put('/books/:id', updateBook); // Check this
router.delete('/books/:id', deleteBook); // Check this
router.get('/books', getAllBooks); // Check this

module.exports = router; // Export the router
