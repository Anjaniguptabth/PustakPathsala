import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './Styles.css';

const AdminSignup = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');


        try {
            const response = await axios.post('http://localhost:5000/api/admin/signup', {
                name,
                email,
                contact: contactNumber,
                password,
            });

            if (response.status === 201) {
                // Successful signup
                alert(t('adminRegisteredSuccessfully')); // Show success message
                setName('');
                setEmail('');
                setPassword('');
                setContactNumber('');   
            } else {
                setErrorMessage(t('signupFailed'));
            }
        } catch (error) {
            console.error('Signup error:', error); // Log the error
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Display specific server error message
            } else {
                setErrorMessage(t('signupFailed'));
            }
        }
    };

    return (
        <div className="form-container">
            <h2>{t('admin')} {t('signup')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder={t('namePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder={t('contactPlaceholder')}
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{t('signup')}</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>
                {t('alreadyHaveAccount')} <a href="/AdminLogin">{t('login')}</a>
            </p>
        </div>
    );
};

export default AdminSignup;
