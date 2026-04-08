const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.render('register', { error: 'Username already exists' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    req.session.userId = newUser._id;
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Error registering user' });
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    req.session.userId = user._id;
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Error logging in' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

module.exports = router;