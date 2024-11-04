// src/components/About.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css'; // External CSS for styling

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <header className="about-header">
        <h1 className="about-title">{t('aboutpustakpathsala')}</h1>
      </header>
      
      <section className="about-section">
        <div className="about-card">
          <h2>{t('A')}</h2>
          <p>{t('library_system')}</p>
        </div>

        <div className="about-card">
          <h2>{t('V')}</h2>
          <p>{t('vision')}</p>
        </div>

        <div className="about-card">
          <h2>{t('developers')}</h2>
          <p>
            <strong>{t('anjani')}</strong>
            <br />
           ReactJS, NodeJS, MongoDB,I/UX Design.
          </p>
          <p>
            <strong>{t('liladhar')}</strong>
            <br />
           NodeJS, MongoDB, JWT Authentication
          </p>
          <p>
            <strong>{t('manav')}</strong>
            <br />
            Documentation , Suggesstion , Testing
          </p>
        </div>

        <div className="about-card">
          <h2>{t('updates')}</h2>
          <p>
            {t('version_1_0')}
            <br />
            {t('version_1_1')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
