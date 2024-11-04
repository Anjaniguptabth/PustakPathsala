import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './UserManagement.css';

const UserManagement = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/user');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert(t('errorFetchingUsers'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = async () => {
        if (!searchTerm) return;
        try {
            const response = await fetch(`http://localhost:5000/api/user/search?name=${searchTerm}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error searching Users:', error);
            alert(`${t('errorSearchingUsers')}: ${error.message}`);
        }
    };

    const confirmDelete = (userId) => {
        setUserToDelete(userId);
        setShowDeletePopup(true);
    };

    const deleteUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/user/${userToDelete}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete user');

            setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete));
            alert(t('userDeletedSuccess'));
            setShowDeletePopup(false);
            setUserToDelete(null);

            // Send email notification
            await fetch(`http://localhost:5000/api/user/notifyDeletion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userToDelete }),
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(t('errorDeletingUser'));
        } finally {
            setLoading(false);
            setShowDeletePopup(false);
        }
    };

    return (
        <div className="user-management-container">
            <h2>{t('userManagement')}</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder={t('searchUserPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {t('search')}
                </button>
            </div>

            {filteredUsers.length === 0 && searchTerm && !loading && (
                <p className="no-users-message">{t('noUsersFound')}</p>
            )}

            <table className="user-table">
                <thead>
                    <tr>
                        <th>{t('userId')}</th>
                        <th>{t('name')}</th>
                        <th>{t('email')}</th>
                        <th>{t('contact')}</th>
                        <th>{t('currentlyIssuedBooks')}</th>
                        <th>{t('fine')}</th>
                        <th>{t('actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.contact}</td>
                            <td>{user.issuedBook ? user.issuedBook.length : 0}</td>
                            <td>{user.fine || 0}</td>
                            <td>
                                <button onClick={() => confirmDelete(user._id)} disabled={loading}>
                                    {t('delete')}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDeletePopup && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <p>{t('confirmDelete')}</p>
                        <div className="modal-buttons">
                            <button
                                className="modal-button confirm"
                                onClick={deleteUser}
                                disabled={loading}
                            >
                                {t('confirm')}
                            </button>
                            <button
                                className="modal-button cancel"
                                onClick={() => setShowDeletePopup(false)}
                                disabled={loading}
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
