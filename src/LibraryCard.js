
import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './LibraryCard.css';

const LibraryCard = () => {
    const { t } = useTranslation(); // Initialize translation hook
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [bookDetails, setBookDetails] = useState({
        id: '',
        title: '',
        author: '',
        year: '',
        imageUrl: '',
        pdf: '',
        totalUnits: 0,
        availableUnits: 0,
        borrowedUnits: 0,
        price: 0,
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
        resetBookDetails(type);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetBookDetails();
    };

    const resetBookDetails = (type = '') => {
        setBookDetails({
            id: '',
            title: '',
            author: '',
            year: '',
            imageUrl: '',
            pdf: '',
            totalUnits: 0,
            availableUnits: 0,
            borrowedUnits: 0,
            price: 0,
        });
        setDeleteConfirmation(type === 'Delete' ? false : true);
    };

    const handleAddBook = async () => {
        if (!bookDetails.title || !bookDetails.author || !bookDetails.year || !bookDetails.totalUnits) {
            alert(t('Please fill in all required fields.')); // Use translation
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/books/add', {
                ...bookDetails,
                year: new Date(bookDetails.year).toISOString(),
                availableUnits: bookDetails.totalUnits,
                borrowedUnits: 0,
            });
            alert(t('Book added successfully')); // Use translation
            closeModal();
        } catch (err) {
            console.error(err);
            alert(t('Failed to add book. Please try again.')); // Use translation
        }
    };

    const handleUpdateBook = async () => {
        if (!bookDetails.id) {
            alert(t('Please provide a book ID for update.')); // Use translation
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/books/update/${bookDetails.id}`, {
                ...bookDetails,
                year: new Date(bookDetails.year).toISOString(),
                availableUnits: bookDetails.totalUnits - bookDetails.borrowedUnits,
            });
            alert(t('Book updated successfully')); // Use translation
            closeModal();
        } catch (err) {
            console.error(err);
            alert(t('Failed to update book. Please try again.')); // Use translation
        }
    };

    const handleFetchBookDetails = async () => {
        if (!bookDetails.id) {
            alert(t('Please provide a book ID.')); // Use translation
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/books/${bookDetails.id}`);
            if (!response.data) {
                alert(t('Book not found')); // Use translation
                return;
            }
            setBookDetails(response.data);
            if (modalType === 'Delete') {
                setDeleteConfirmation(true);
            }
        } catch (err) {
            console.error(err);
            alert(t('Failed to fetch book details. Please try again.')); // Use translation
        }
    };

    const confirmDeleteBook = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/books/delete/${bookDetails._id}`);
            alert(t('bookDeleted'));
            closeModal();
        } catch (err) {
            console.error(err);
            alert(t('failedToDelete'));
        }
    };

    const handleViewBooks = () => {
        navigate('/View-Books');
    };


    return (
        <div className="library-management-card">
            <h2>{t('libraryManagement')}</h2>
            <div className="button-container">
                <button onClick={() => openModal('Add')}>{t('addBook')}</button>
                <button onClick={() => openModal('Update')}>{t('updateBook')}</button>
                <button onClick={() => openModal('Delete')}>{t('deleteBook')}</button>
                <button onClick={handleViewBooks}>{t('viewBooks')}</button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel={t('manageBook')}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>{t(`${modalType.toLowerCase()}Book`)}</h2>
                {modalType !== 'Delete' && (
                    <form>
                        {modalType !== 'Add' && (
                            <label>
                                {t('bookId')}:
                                <input
                                    type="text"
                                    name="id"
                                    value={bookDetails.id}
                                    onChange={handleInputChange}
                                    placeholder={t('enterBookId')}
                                />
                            </label>
                        )}
                        <label>
                            {t('title')}:
                            <input
                                type="text"
                                name="title"
                                value={bookDetails.title}
                                onChange={handleInputChange}
                                placeholder={t('enterBookTitle')}
                                required
                            />
                        </label>
                        <label>
                            {t('author')}:
                            <input
                                type="text"
                                name="author"
                                value={bookDetails.author}
                                onChange={handleInputChange}
                                placeholder={t('enterAuthorName')}
                                required
                            />
                        </label>
                        <label>
                            {t('year')}:
                            <input
                                type="date"
                                name="year"
                                value={bookDetails.year ? bookDetails.year.substring(0, 10) : ''}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            {t('imageUrl')}:
                            <input
                                type="text"
                                name="imageUrl"
                                value={bookDetails.imageUrl}
                                onChange={handleInputChange}
                                placeholder={t('enterImageUrl')}
                            />
                        </label>
                        <label>
                            {t('pdfLink')}:
                            <input
                                type="text"
                                name="pdf"
                                value={bookDetails.pdf}
                                onChange={handleInputChange}
                                placeholder={t('enterPdfLink')}
                            />
                        </label>
                        <label>
                            {t('totalUnits')}:
                            <input
                                type="number"
                                name="totalUnits"
                                value={bookDetails.totalUnits}
                                onChange={handleInputChange}
                                placeholder={t('\enterTotalUnits')}
                                required
                                min="0"
                            />
                        </label>
                        <label>
                            {t('price')}:
                            <input
                                type="number"
                                name="price"
                                value={bookDetails.price}
                                onChange={handleInputChange}
                                placeholder={t('enterPrice')}
                                required
                                min="0"
                            />
                        </label>
                    </form>
                )}
                {modalType === 'Delete' && !deleteConfirmation && (
                    <div>
                        <label>
                            {t('bookId')}:
                            <input
                                type="text"
                                name="id"
                                value={bookDetails.id}
                                onChange={handleInputChange}
                                placeholder={t('enterBookId')}
                            />
                        </label>
                        <button onClick={handleFetchBookDetails}>{t('fetchBook')}</button>
                    </div>
                )}
                {modalType === 'Delete' && deleteConfirmation && (
                    <div>
                        <p>{t('confirmationMessage')}</p>
                        <ul>
                            <li><strong>{t('id')}:</strong> {bookDetails._id}</li>
                            <li><strong>{t('title')}:</strong> {bookDetails.title}</li>
                            <li><strong>{t('author')}:</strong> {bookDetails.author}</li>
                            <li><strong>{t('year')}:</strong> {new Date(bookDetails.year).toLocaleDateString()}</li>
                            <li><strong>{t('totalUnits')}:</strong> {bookDetails.totalUnits}</li>
                            <li><strong>{t('availableUnits')}:</strong> {bookDetails.availableUnits}</li>
                            <li><strong>{t('imageUrl')}:</strong> {bookDetails.imageUrl}</li>
                            <li><strong>{t('pdfLink')}:</strong> {bookDetails.pdf}</li>
                            <li><strong>{t('cost')}:</strong> {bookDetails.price}</li>
                        </ul>
                        <button onClick={confirmDeleteBook}>{t('confirmDelete')}</button>
                        <button onClick={closeModal}>{t('cancel')}</button>
                    </div>
                )}
                {modalType === 'Update' && (
                    <div>
                        <button onClick={handleFetchBookDetails}>{t('fetchBook')}</button>
                    </div>
                )}
                {modalType !== 'Delete' && (
                    <div className="modal-buttons">
                        {modalType === 'Add' && <button onClick={handleAddBook}>{t('addBook')}</button>}
                        {modalType === 'Update' && <button onClick={handleUpdateBook}>{t('updateBook')}</button>}
                        <button onClick={closeModal}>{t('close')}</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default LibraryCard;