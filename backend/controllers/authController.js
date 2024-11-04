// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  const { name, email, password, contactNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, contactNumber });

    res.status(201).json({ message: 'User created successfully', userId: newUser._id });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


