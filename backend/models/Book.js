const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Date, required: true },
    imageUrl: { type: String, required: false },
    pdf: { type: String, required: false },
    totalUnits: { type: Number, required: true },
    availableUnits: { type: Number, required: true },
    borrowedUnits: { type: Number, required: true },
    price: { type: Number, required: true },
});

const Book = mongoose.model('Book', bookSchema);
module.exports= Book;
