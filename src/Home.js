import React from 'react';
import './App.css'; // Assuming you will write styles here
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Home = ({ books }) => {
  const { t } = useTranslation(); // Initialize translation hook

  // Open the PDF in a new tab
  const openBookPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert(t('pdfNotAvailable')); // Translation for 'PDF not available'
    }
  };

  return (
    <main className="main-background">
      <section className="auth-section">
        <div className="box admin-box">
          <h1>{t('admin')}</h1>
          <button onClick={() => (window.location.href = '/AdminLogin')} aria-label={t('login')}>
            {t('login')}
          </button>
          <button onClick={() => (window.location.href = '/AdminSignup')} aria-label={t('signup')}>
            {t('signup')}
          </button>
        </div>
        <div className="box user-box">
          <h1>{t('user')}</h1>
          <button onClick={() => (window.location.href = '/UserLogin')} aria-label={t('login')}>
            {t('login')}
          </button>
          <button onClick={() => (window.location.href = '/UserSignup')} aria-label={t('signup')}>
            {t('signup')}
          </button>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books">
        <h2 className='fe'>{t('featuredBooks')}</h2>
        <div className="books-grid">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div
                key={index}
                className="book-card"
                onClick={() => openBookPdf(book.pdf)}  // Open the PDF when clicked
                role="button" // Role attribute for accessibility
                tabIndex={0} // Make it focusable for keyboard users
                onKeyPress={(e) => (e.key === 'Enter' ? openBookPdf(book.pdf) : null)} // Allow PDF opening via keyboard
              >
                <img src={book.imageUrl} alt={book.name} />
                <p>{book.name}</p>
                <p>{book.author}</p>
                <p>{book.year}</p>
              </div>
            ))
          ) : (
            <p>{t('noBooksAvailable')}</p> // Translation for 'No books available'
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
