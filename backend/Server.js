const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // This automatically parses JSON bodies

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anjaniguptasde@gmail.com', // Your email
        pass: 'pouv adaj psxv wfjg', // Replace with your Gmail app password or regular password (if less secure apps are enabled)
    }
});

// Route to handle contact form submission
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Basic input validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    // Validate email format (simple regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Mail options
    const mailOptions = {
        from: email, // Sender's email
        to: 'anjaniguptasde@gmail.com', // Your email to receive the contact form data
        subject: `Contact Form Submission from ${name}`,
        text: `You received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>` // HTML formatted email
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Failed to send email:', error);
        return res.status(500).json({ error: 'Failed to send email.' });
    }
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/user', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
