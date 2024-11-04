import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookCRUD = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    name: '',
    author: '',
    year: '',
    imageUrl: '',
    pdf: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await axios.get('http://localhost:5000/api/books');
    setBooks(data);
  };

  const handleCreate = async () => {
    await axios.post('http://localhost:5000/api/books', newBook);
    fetchBooks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    fetchBooks();
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/api/books/${id}`, newBook);
    fetchBooks();
  };

  return (
    <div>
      <h1>Manage Books</h1>
      <input type="text" placeholder="Book Name" onChange={(e) => setNewBook({ ...newBook, name: e.target.value })} />
      <input type="text" placeholder="Author" onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
      <button onClick={handleCreate}>Add Book</button>

      <ul>
        {books.map((book) => (
          <li key={book._id}>
            {book.name} by {book.author}
            <button onClick={() => handleUpdate(book._id)}>Update</button>
            <button onClick={() => handleDelete(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookCRUD;
