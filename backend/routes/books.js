// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User')

// POST route for issuing a book
router.post('/issue', async (req, res) => {
    const { userId, bookId } = req.body;

    try {
        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if the book has available units
        if (book.availableUnits <= 0) {
            return res.status(400).json({ message: 'No units available' });
        }

        // Find the user by ID
        const user = await User.findById(userId); // This line references the User model
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the book is already issued to the user
        if (user.issuedBook.includes(bookId)) {
            return res.status(400).json({ message: 'Book already issued to this user' });
        }

        // Issue the book
        user.issuedBook.push(bookId);
        book.availableUnits -= 1;

        // Save the updated user and book
        await user.save();
        await book.save();

        return res.status(200).json({ message: 'Book issued successfully!' });
    } catch (error) {
        console.error('Error issuing book:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
});

// In your book.js or similar routes file
router.patch('/:id/return', async (req, res) => {
    const { userId, bookId } = req.body;
  
    try {
      // Find the user and update their issued books
      await User.findByIdAndUpdate(userId, { $pull: { issuedBook: bookId } });
  
      // Find the book and increment its available units
      await Book.findByIdAndUpdate(bookId, { $inc: { availableUnits: 1 } });
  
      res.status(200).send({ message: 'Book returned successfully' });
    } catch (error) {
      res.status(500).send({ message: 'Error returning the book' });
    }
  });
  
// In your Express route file (e.g., routes/bookRoutes.js)
router.get('/search', async (req, res) => {
    const { title }= req.query;
    console.log('Search Title:', title);
    try {
            const books = await Book.find({ title: { $regex: title, $options: 'i' } });
            console.log('Search Results:', books); // Debugging
            res.json(books);
        } catch (err) {
            console.error('Error searching books:', err);
            res.status(500).json({ message: 'Error searching books' });
        }
    });

    // Assuming you have a User model and Book model set up
// In your return book route
router.post('/return', async (req, res) => {
    const { userId, bookId } = req.body;
  
    try {
      // Find the user and update their issued books
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      // Remove the bookId from issuedBook array
      user.issuedBook = user.issuedBook.filter(id => id.toString() !== bookId);
      
      // Optionally: Increase the available units of the book
      const book = await Book.findById(bookId);
      if (book) {
        book.availableUnits += 1; // Increase available units
        await book.save(); // Save the updated book
      }
  
      await user.save(); // Save the updated user
      res.status(200).send('Book returned successfully.');
    } catch (error) {
      res.status(500).send('Error returning book.');
    }
  });
  

// Get a book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new book
router.post('/add', async (req, res) => {
    try {
        const {
            title,
            author,
            year,
            imageUrl,
            pdf,
            totalUnits,
            availableUnits,
            price
        } = req.body;

        // Check for required fields
        if (!title || !author || !year || totalUnits === undefined || availableUnits === undefined || price === undefined) {
            return res.status(400).json({ error: 'Title, author, year, totalUnits, availableUnits, and price are required fields.' });
        }

        // Create new book instance
        const newBook = new Book({
            title,
            author,
            year,
            imageUrl,
            pdf,
            totalUnits,
            borrowedUnits: 0, // Set borrowedUnits to 0 permanently
            availableUnits,
            price
        });
        
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a book
router.put('/update/:id', async (req, res) => {
    try {
        const {
            title,
            author,
            year,
            imageUrl,
            pdf,
            totalUnits,
            availableUnits,
            price
        } = req.body;

        // Check for required fields
        if (!title || !author || !year || totalUnits === undefined || availableUnits === undefined || price === undefined) {
            return res.status(400).json({ error: 'Title, author, year, totalUnits, availableUnits, and price are required fields.' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                title,
                author,
                year,
                imageUrl,
                pdf,
                totalUnits,
                borrowedUnits: 0, // Ensure borrowedUnits remains 0 on update
                availableUnits,
                price
            },
            { new: true }
        );
        
        if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
        res.json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('Fetched Books:', books);
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: 'Error fetching books' });
    }
});

// Route to delete a book by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    console.log("Book ID:", id); // Log the ID for debugging
    
    if (!id) {
        return res.status(400).json({ error: 'Book ID is required' });
    }

    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
