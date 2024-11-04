const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Signup
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const admin = new Admin({ name, email, password, contactNumber });
    await admin.save();
    res.status(201).json({ message: 'Admin signed up successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up admin', error });
  }
};

// Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token, adminId: admin._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
