const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const User = require('../models/User');

const router = express.Router();

// Register
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.render('register', { error: 'Please fill in all fields' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).render('register', { error: 'Username or email already exists' });
    }
    const user = await User.create({ username, email, password });

    const token = jwt.sign(
      { id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }
    );
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
 
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }
    );
    res.status(200).json({message: "Login successful", token, user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
  res.redirect('/auth/login');
});

module.exports = router;