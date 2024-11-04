import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './AdminDashboard.css';

const IssueBookOptions = ({ onClose, onSelectOption }) => {
  const { t } = useTranslation();
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{t('issueBook')}</h2>
        <button onClick={() => onSelectOption('issue')}>{t('issueBook')}</button>
        <button onClick={() => onSelectOption('return')}>{t('returnBook')}</button>
        <button onClick={onClose}>{t('close')}</button>
      </div>
    </div>
  );
};

const IssueBookForm = ({ onClose, onIssueSuccess }) => {
  const { t } = useTranslation();
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [bookDetails, setBookDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
      if (response.data) {
        setBookDetails(response.data);
        setErrorMessage('');
      } else {
        setErrorMessage(t('bookNotFound'));
        setBookDetails(null);
      }
    } catch (error) {
      setErrorMessage(t('fetchBookError'));
      setBookDetails(null);
    }
  };

  const handleFetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
      if (response.data) {
        setUserDetails(response.data);
        setErrorMessage('');
      } else {
        setErrorMessage(t('userNotFound'));
        setUserDetails(null);
      }
    } catch (error) {
      setErrorMessage(t('fetchUserError'));
      setUserDetails(null);
    }
  };

  const handleIssueBook = async () => {
    if (bookDetails && userDetails && bookDetails.availableUnits > 0 && !userDetails.issuedBook.includes(bookId)) {
      try {
        await axios.post(`http://localhost:5000/api/books/issue`, { userId, bookId });
        onIssueSuccess();
        alert(t('bookIssuedSuccess'));
        onClose();
      } catch (error) {
        setErrorMessage(t('issueBookFailed'));
      }
    } else {
      setErrorMessage(t('bookNotAvailable'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{t('issueBook')}</h2>
        <input type="text" placeholder={t('bookIdPlaceholder')} value={bookId} onChange={(e) => setBookId(e.target.value)} />
        <button onClick={handleFetchBook}>{t('fetchBook')}</button>
        {bookDetails && (
          <div>
            <p>{t('bookTitle')}: {bookDetails.title}</p>
            <p>{t('availableUnits')}: {bookDetails.availableUnits}</p>
          </div>
        )}
        <input type="text" placeholder={t('userIdPlaceholder')} value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={handleFetchUser}>{t('fetchUser')}</button>
        {userDetails && (
          <div>
            <p>{t('userName')}: {userDetails.name}</p>
          </div>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleIssueBook}>{t('confirmIssue')}</button>
        <button onClick={onClose}>{t('cancel')}</button>
      </div>
    </div>
  );
};

const ReturnBookForm = ({ onClose, onReturnSuccess }) => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
      if (response.data) {
        setUserDetails(response.data);
        setErrorMessage('');
      } else {
        setErrorMessage(t('userNotFound'));
        setUserDetails(null);
      }
    } catch (error) {
      setErrorMessage(t('fetchUserError'));
      setUserDetails(null);
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await axios.post(`http://localhost:5000/api/books/return`, { userId, bookId });
      onReturnSuccess();
      alert(t('bookReturnedSuccess'));
      handleFetchUser();
    } catch (error) {
      setErrorMessage(t('returnBookFailed'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{t('issueBook')}</h2>
        <input type="text" placeholder={t('userIdPlaceholder')} value={userId} onChange={(e) => setUserId(e.target.value)} />
        <button onClick={handleFetchUser}>{t('fetchUser')}</button>
        {userDetails && (
          <div>
            <p>{t('userName')}: {userDetails.name}</p>
            <h3>{t('issuedBooks')}</h3>
            <table>
              <thead>
                <tr>
                  <th>{t('bookId')}</th>
                  <th>{t('bookName')}</th>
                  <th>{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.issuedBook && userDetails.issuedBook.length > 0 ? (
                  userDetails.issuedBook.map((bookId) => (
                    <tr key={bookId}>
                      <td>{bookId}</td>
                      <td>{userDetails.books ? userDetails.books.find(book => book._id === bookId)?.title : "N/A"}</td>
                      <td>
                        <button onClick={() => handleReturnBook(bookId)}>{t('return')}</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">{t('noIssuedBooks')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={onClose}>{t('cancel')}</button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [showIssueOptions, setShowIssueOptions] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/AdminLogin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/AdminLogin');
  };

  const handleOptionSelect = (option) => {
    if (option === 'issue') {
      setShowIssueForm(true);
    } else if (option === 'return') {
      setShowReturnForm(true);
    }
    setShowIssueOptions(false);
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="logout-button">{t('logout')}</button>
      <h1>{t('adminDashboard')}</h1>

      <div className="card-container">
        <div className="dashboard-card">
          <h2>{t('viewUser')}</h2>
          <p>{t('viewUserDescription')}</p>
          <Link to="/UserManagement"><button>{t('clickHere')}</button></Link>
        </div>
        <div className="dashboard-card" onClick={() => setShowIssueOptions(true)}>
          <h2>{t('issueBook')}</h2>
          <p>{t('issueBookDescription')}</p>
          <button>{t('clickHere')}</button>
        </div>
        <div className="dashboard-card">
          <h2>{t('libraryManagement')}</h2>
          <p>{t('libraryManagementDescription')}</p>
          <Link to="/LibraryCard"><button>{t('clickHere')}</button></Link>
        </div>
      </div>

      {showIssueOptions && <IssueBookOptions onClose={() => setShowIssueOptions(false)} onSelectOption={handleOptionSelect} />}
      {showIssueForm && <IssueBookForm onClose={() => setShowIssueForm(false)} onIssueSuccess={() => setShowIssueForm(false)} />}
      {showReturnForm && <ReturnBookForm onClose={() => setShowReturnForm(false)} onReturnSuccess={() => setShowReturnForm(false)} />}
    </div>
  );
};

export default AdminDashboard;
