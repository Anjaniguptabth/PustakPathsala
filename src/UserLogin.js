import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Styles.css';

const UserLogin = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/user/login', {
                email,
                password,
            });

            if (response.data.token) {
                // Store token and redirect to the view books page
                localStorage.setItem('userToken', response.data.token);
                alert(t('loginSuccessfully')); // Show success message
                navigate('/ViewBookUser'); // Redirecting to View Books page
            } else {
                setErrorMessage(t('loginFailed'));
            }
        } catch (error) {
            // Better error handling based on the error response
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || t('loginFailed'));
            } else {
                setErrorMessage(t('loginFailed'));
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className="form-container">
            <h2>{t('user')} {t('login')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{t('login')}</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>
                {t('dontHaveAccount')} <a href="/UserSignup">{t('signup')}</a>
            </p>
        </div>
    );
};

export default UserLogin;
