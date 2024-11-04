require('dotenv').config(); // Load environment variables

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Log email user to verify it’s loaded correctly
console.log("Email User:", process.env.EMAIL_USER);

// Email configuration using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API route to handle form submissions
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'anjaniguptasde@gmail.com',
    subject: `New Contact Form Submission from ${name}`,
    text: `You have received a new message from ${name} (${email}):\n\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'Email sent successfully!' });
    }
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
