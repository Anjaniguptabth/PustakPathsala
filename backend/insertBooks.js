const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book'); // Ensure this path is correct

dotenv.config();

// Sample data to insert
const books = [
  {
    name: 'The Tale of Peter Rabbit',
    author: 'Beatrix Potter',
    year: '1907',
    imageUrl: 'https://books.google.co.in/books/content?id=llpAAQAAIAAJ&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U2Gic3XK5CP4mzUQuxZBIZiU4JvPw&w=1280',
    pdf: 'https://www.google.co.in/books/edition/The_Tale_of_Peter_Rabbit/llpAAQAAIAAJ?hl=en&gbpv=1'
  },
  {
    name: 'The Constitution of India – in Diglot Edition',
    author: 'Dr. BabaSaheb Bhimrao Ambekar',
    year: '1950',
    imageUrl: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/regionalbooks/i/c/e/bharat-ka-sanvidhan-the-constitution-of-india-original-imagpv9ufssre7sj.jpeg?q=90&crop=false',
    pdf: 'https://lddashboard.legislative.gov.in/sites/default/files/Savidhan.pdf'
  },
  {
    name: 'Ratan Tata A Complete Biography',
    author: 'A.K. Gandhi',
    year: '2021',
    imageUrl: 'https://m.media-amazon.com/images/I/71ppIPqdYNL._SL1500_.jpg',
    pdf: 'https://www.google.co.in/books/edition/Ratan_Tata_A_Complete_Biography/zVBREAAAQBAJ?hl=en&gbpv=1'
  },
  {
    name: 'GulaamGiri',
    author: 'JYOTIBA PHULE',
    year: '1827',
    imageUrl: 'https://m.media-amazon.com/images/I/81cMnNCSunL._SL1500_.jpg',
    pdf: 'https://drambedkarbooks.com/wp-content/uploads/2015/04/gulamgiri-in-hindi.pdf'
  },
  {
    name: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: '1925',
    imageUrl: 'https://m.media-amazon.com/images/I/81Q6WkLhX4L._UF1000,1000_QL80_.jpg',
    pdf: 'https://www.planetebook.com/free-ebooks/the-great-gatsby.pdf'
  },
  {
    name: 'Fight for Me',
    author: 'Hannah Martinez',
    year: '2023',
    imageUrl: 'https://m.media-amazon.com/images/I/81z0SeTMB-L._SY466_.jpg',
    pdf: 'https://play.google.com/books/reader?id=6gG7EAAAQBAJ&pg=GBS.PT193.w.0.6.2_165&hl=en'
  },
  {
    name: 'Pahile Prem',
    author: 'V. S. Khandekar',
    year: '2019',
    imageUrl: 'https://d34a0mln2492j4.cloudfront.net/unsigned/resize:fit:488:688:0/gravity:sm/plain/https%3A%2F%2Fbookscape-s3-bucket.s3.amazonaws.com%2Fproduct_images%2F9788177663761.jpg',
    pdf: 'https://www.google.co.in/books/edition/PAHILE_PREM/BN5fAwAAQBAJ?hl=en&gbpv=1&dq=Pahile+Prem&printsec=frontcover'
  },
  {
    name: 'Bhagavad Gita',
    author: 'Veda-Vyasa',
    year: '------',
    imageUrl: 'https://m.media-amazon.com/images/I/71ouH7IhMVL._AC_UF1000,1000_QL80_.jpg',
    pdf: 'https://yogalife.co.in/wp-content/uploads/2017/04/Bhagavad-gita-hindi.pdf'
  }
];

// Inserting the data into MongoDB
const insertBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await Book.insertMany(books);
    console.log('Books inserted');
  } catch (error) {
    console.error('Error inserting books:', error.message);
  } finally {
    await mongoose.connection.close();
  }
};

insertBooks();
