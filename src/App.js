import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faInfoCircle, faEnvelope, faGlobe } from '@fortawesome/free-solid-svg-icons';

import './App.css'; 
import About from './About';  
import Home from './Home';    
import Contact from './Contact';
import AdminLogin from './AdminLogin';
import AdminSignup from './AdminSignup';
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagemenet';
import LibraryCard from './LibraryCard';
import ViewBooks from './ViewBooks';
import ViewBookUser from './ViewBookUser';

function App() {
  const { t, i18n } = useTranslation();
  
  const [books, setBooks] = useState([
    { name: 'The Tale of Peter Rabbit', author: 'Beatrix Potter', year: '1907', imageUrl: 'https://books.google.co.in/books/content?id=llpAAQAAIAAJ&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U2Gic3XK5CP4mzUQuxZBIZiU4JvPw&w=1280', pdf: 'https://www.google.co.in/books/edition/The_Tale_of_Peter_Rabbit/llpAAQAAIAAJ?hl=en&gbpv=1' },
    { name: 'The Constitution of India – in Diglot Edition', author: 'Dr. BabaSaheb Bhimrao Ambedkar', year: '1950', imageUrl: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/regionalbooks/i/c/e/bharat-ka-sanvidhan-the-constitution-of-india-original-imagpv9ufssre7sj.jpeg?q=90&crop=false', pdf: 'https://lddashboard.legislative.gov.in/sites/default/files/Savidhan.pdf' },
    { name: 'Ratan Tata A Complete Biography', author: 'A.K. Gandhi', year: '2021', imageUrl: 'https://m.media-amazon.com/images/I/71ppIPqdYNL._SL1500_.jpg', pdf: 'https://www.google.co.in/books/edition/Ratan_Tata_A_Complete_Biography/zVBREAAAQBAJ?hl=en&gbpv=1' },
    { name: 'GulaamGiri', author: 'JYOTIBA PHULE', year: '1827', imageUrl: 'https://m.media-amazon.com/images/I/81cMnNCSunL._SL1500_.jpg', pdf: 'https://drambedkarbooks.com/wp-content/uploads/2015/04/gulamgiri-in-hindi.pdf' },
    { name: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: '1925', imageUrl: 'https://m.media-amazon.com/images/I/81Q6WkLhX4L._UF1000,1000_QL80_.jpg', pdf: 'https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf' },
    { name: 'Fight for Me', author: 'Hannah Martinez', year: '2023', imageUrl: 'https://m.media-amazon.com/images/I/81z0SeTMB-L._SY466_.jpg', pdf: 'https://play.google.com/books/reader?id=6gG7EAAAQBAJ&pg=GBS.PT193.w.0.6.2_165&hl=en' },
    { name: 'Pahile Prem', author: 'V. S. Khandekar', year: '2019', imageUrl: 'https://d34a0mln2492j4.cloudfront.net/unsigned/resize:fit:488:688:0/gravity:sm/plain/https%3A%2F%2Fbookscape-s3-bucket.s3.amazonaws.com%2Fproduct_images%2F9788177663761.jpg', pdf: 'https://www.google.co.in/books/edition/PAHILE_PREM/BN5fAwAAQBAJ?hl=en&gbpv=1&dq=Pahile+Prem&printsec=frontcover' },
    { name: 'Bhagavad Gita', author: 'Veda-Vyasa', year: '------', imageUrl: 'https://m.media-amazon.com/images/I/71ouH7IhMVL._AC_UF1000,1000_QL80_.jpg', pdf: 'https://yogalife.co.in/wp-content/uploads/2017/04/Bhagavad-gita-hindi.pdf' }
  ]);

  const [languageIndex, setLanguageIndex] = useState(0);
  const languages = ['mr', 'en', 'hi'];

  // Fetch books based on selected language
  const fetchBooks = (lang) => {
    axios.get(`http://localhost:5000/api/books?lang=${lang}`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error("Invalid books data:", response.data);
        }
      })
      .catch(error => {
        console.error("Error fetching books:", error);
      });
  };

  // Language toggle function
  const changeLanguage = () => {
    const newIndex = (languageIndex + 1) % languages.length;
    const newLang = languages[newIndex];
    setLanguageIndex(newIndex);
    i18n.changeLanguage(newLang);
    fetchBooks(newLang);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <header className="navbar">
          <div className="left-section">
            <span className="ps-symbol">PS</span>
            <span className="brand-name">{t('pustakPathsala')}</span>
          </div>

          {/* Hamburger Menu */}
          <div className="hamburger" onClick={toggleMenu}>
            <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
            <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
            <div className={`bar ${menuOpen ? 'active' : ''}`}></div>
          </div>

          {/* Right Section: Language & Nav Links */}
          <div className={`right-section ${menuOpen ? 'active' : ''}`}>
            <button className="language-icon" onClick={changeLanguage} title={t('changeLanguage')}>
              <FontAwesomeIcon icon={faGlobe} />
            </button>
            <nav>
              <Link to="/"><FontAwesomeIcon icon={faHome} /> {t('home')}</Link>
              <Link to="/about"><FontAwesomeIcon icon={faInfoCircle} /> {t('about')}</Link>
              <Link to="/contact"><FontAwesomeIcon icon={faEnvelope} /> {t('contact')}</Link>
            </nav>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home books={books} t={t} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminSignup" element={<AdminSignup />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/UserSignup" element={<UserSignup />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/LibraryCard" element={<LibraryCard />} />
          <Route path="/view-books" element={<ViewBooks />} />
          <Route path="/ViewBookUser" element={<ViewBookUser />} />
        </Routes>

        {/* Footer */}
        <footer className="footer">
          <p>@theshield 2024</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
