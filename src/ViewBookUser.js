import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ViewBookUser.css';

const ViewBookUser = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Check for authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/UserLogin'); // Redirect to UserLogin page if not authenticated
        }
    }, [navigate]);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/books');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFilteredBooks(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            alert(t('errorFetchingBooks'));
            setIsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleSearch = async () => {
        if (!searchTerm) return;
        try {
            const response = await fetch(`http://localhost:5000/api/books/search?title=${searchTerm}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFilteredBooks(data);
        } catch (error) {
            console.error('Error searching books:', error);
            alert(`${t('errorSearchingBooks')}: ${error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken'); // Clear the token
        navigate('/UserLogin'); // Redirect to login page
    };

    return (
        <div className="view-books">
            <div className="header-actions">
                <button className="logout-button" onClick={handleLogout}>
                    {t('logout')}
                </button>
            </div>
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
            {isLoading ? (
    <p>{t('loading')}</p>
) : filteredBooks.length === 0 && searchTerm ? (
    <p>{t('noBooksFound')}</p>
) : filteredBooks.length === 0 ? (
    <div className="no-books-message">
        <h3>{t('noBooksAvailable')}</h3>
    </div>
) : (
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
                    <td>{book.price}</td>
                </tr>
            ))}
        </tbody>
    </table>
)}

        </div>
    );
};

export default ViewBookUser;
