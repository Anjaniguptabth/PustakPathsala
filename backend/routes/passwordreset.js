const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Adjust this for Admin or User
const Admin = require('../models/Admin');

const router = express.Router();

// POST: Request password reset link
router.post('/request-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set up Nodemailer to send the reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'anjaniguptasde@gmail.com', // Your email
        pass: 'kdzj ynpr bucp bqcq', // Your email password or app password
            },
        });

        // Update the reset link to include the correct endpoint
        const resetLink = `http://localhost:5000/api/user/passwordreset/${token}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET: Validate token (Optional)
router.get('/validate-token/:token', (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ valid: true });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// POST: Reset password
router.post('/passwordreset/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
