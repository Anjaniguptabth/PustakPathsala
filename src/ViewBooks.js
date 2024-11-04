// ViewBooks.js

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './ViewBooks.css';

const ViewBooks = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    // Fetch all books on component mount
    const fetchBooks = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/books');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Fetched Books:', data); // Debugging
            setFilteredBooks(data); // Initialize filtered books with all books
        } catch (error) {
            console.error('Error fetching books:', error);
            alert(t('errorFetchingBooks')); // Notify the user about the error
        }
    }, [t]);

    useEffect(() => {
        fetchBooks(); // Fetch books when the component mounts
    }, [fetchBooks]);

    // Handle search functionality
    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/books/search?title=${searchTerm}`);
            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.message || 'Network response was not ok');
            }
            const data = await response.json();
            setFilteredBooks(data);
            if (data.length === 0) {
                console.log('No books found');
            }
        } catch (error) {
            console.error('Error searching books:', error);
            alert(`${t('errorSearchingBooks')}: ${error.message}`);
        }
    };

    return (
        <div className="view-books">
            <h2>{t('viewBooks')}</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder={t('searchBookPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>{t('search')}</button>
            </div>
            {filteredBooks.length === 0 && searchTerm && (
                <p>{t('noBooksFound')}</p>
            )}
            {filteredBooks.length === 0 && !searchTerm && ( // Full-screen message when no books are available
                <div className="no-books-message">
                    <h3>{t('noBooksAvailable')}</h3>
                </div>
            )}
            {filteredBooks.length > 0 && (
                <table className="books-table">
                    <thead>
                        <tr>
                            <th>{t('ID')}</th>
                            <th>{t('Title')}</th>
                            <th>{t('Author')}</th>
                            <th>{t('Year')}</th>
                            <th>{t('Image')}</th>
                            <th>{t('PDF')}</th>
                            <th>{t('Total Units')}</th>
                            <th>{t('Available Units')}</th>
                            <th>{t('Borrowed Units')}</th>
                            <th>{t('Price')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map(book => (
                            <tr key={book._id}>
                                <td>{book._id}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>{new Date(book.year).getFullYear()}</td>
                                <td>
                                    {book.imageUrl ? (
                                        <img src={book.imageUrl} alt={book.title} className="book-image" />
                                    ) : (
                                        <span>{t('noImage')}</span>
                                    )}
                                </td>
                                <td>
                                    {book.pdf ? (
                                        <a href={book.pdf} target="_blank" rel="noopener noreferrer">
                                            {t('viewPdf')}
                                        </a>
                                    ) : (
                                        <span>{t('noPdf')}</span>
                                    )}
                                </td>
                                <td>{book.totalUnits}</td>
                                <td>{book.availableUnits}</td>
                                <td>{book.borrowedUnits}</td>
                                <td>{book.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewBooks;
