import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Contact.css";

const Contact = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle response
      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setError(false);

        // Clear form fields only on success
        setFormData({
          name: '',
          email: '',
          message: ''
        });

        // Auto-close success popup after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(true);
      setSubmitted(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>{t('contactTitle')}</h1>
      <p>{t('contactDescription')}</p>

      {/* Success message popup */}
      {submitted && (
        <div className="popup success">
          <p>{t('contactThankYou')}</p>
          <button onClick={() => setSubmitted(false)}>{t('closeButton')}</button>
        </div>
      )}

      {/* Error message popup */}
      {error && (
        <div className="popup error">
          <p>{t('contactError')}</p>
          <button onClick={() => setError(false)}>{t('closeButton')}</button>
        </div>
      )}

      {/* Contact form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{t('nameLabel')}:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={t('namePlaceholder')}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('emailLabel')}:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t('emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">{t('messageLabel')}:</label>
          <textarea
            id="message"
            name="message"
            placeholder={t('messagePlaceholder')}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          {t('sendMessageButton')}
        </button>
      </form>
    </div>
  );
};

export default Contact;
