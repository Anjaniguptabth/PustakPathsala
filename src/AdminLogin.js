import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Styles.css';

const AdminLogin = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for button
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true); // Set loading to true when the request starts

        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', { email, password });

            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
                alert(t('loginSuccessfully')); // Show success message
                navigate('/AdminDashboard');
            } else {
                setErrorMessage(t('loginFailed'));
            }
        } catch (error) {
            setErrorMessage(t('loginFailed'));
            console.error('Login error:', error);
        } finally {
            setLoading(false); // Set loading to false after request completion
        }
    };

    return (
        <div className="form-container">
            <h2>{t('admin')} {t('login')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label={t('email')}
                />
                <input
                    id="password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label={t('password')}
                />
                <button type="submit" disabled={loading}>
                    {loading ? t('loading') : t('login')}
                </button>
            </form>
            {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}
            <p>
                {t('dontHaveAccount')} <a href="/AdminSignup">{t('signup')}</a>
            </p>
        </div>
    );
};

export default AdminLogin;
