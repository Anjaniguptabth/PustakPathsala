const Book = require('../models/book.model');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { name, author, year, imageUrl, pdf } = req.body;
    const book = new Book({ name, author, year, imageUrl, pdf });
    await book.save();
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, { new: true });
    res.status(200).json({ message: 'Book updated successfully', updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};
