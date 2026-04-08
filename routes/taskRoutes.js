const express = require('express');
const Task = require('../models/Task');

const router = express.Router();

// Middleware to check authentication
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
}

// Get tasks with sorting
router.get('/', isAuthenticated, async (req, res) => {
  const { status } = req.query; // 'pending' or 'completed'
  const filter = { user: req.session.userId };
  if (status) {
    filter.status = status;
  } else {
    filter.status = { $in: ['pending', 'completed'] };
  }
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.render('tasks', { tasks, status: status || 'all' });
});

// Create task
router.post('/add', isAuthenticated, async (req, res) => {
  const { description } = req.body;
  try {
    const newTask = new Task({ user: req.session.userId, description });
    await newTask.save();
    res.redirect('/taskRoutes');
  } catch (err) {
    console.error(err);
    res.redirect('/taskRoutes');
  }
});

// Update task status
router.post('/update/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'completed' or 'deleted'
  try {
    await Task.updateOne({ _id: id, user: req.session.userId }, { status });
    res.redirect('/taskRoutes');
  } catch (err) {
    console.error(err);
    res.redirect('/taskRoutes');
  }
});

module.exports = router;