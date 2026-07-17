const express = require('express');
const router = express.Router();

const Task = require('../models/Task');
const User = require('../models/User');

const jwtAuth = require('../middleware/jwtAuth');
const sendEmail = require('../utils/email');
const { sendNotification } = require('../websocket');


// Get tasks with sorting
router.get('/', jwtAuth, async (req, res) => {
  const { status, message, error } = req.query;
  const filter = { user: req.user.id };
  if (status) {
    filter.status = status;
  } else {
    filter.status = { $in: ['pending', 'completed'] };
  }
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.render('tasks', { tasks, status: status || 'all', message, error });
});

// Create task
router.post('/', jwtAuth, async (req, res) => {
  const { description, dueDate } = req.body;
  try {
    if (!description || !dueDate) {
      return res.redirect('/tasks?error=' + encodeURIComponent('Please provide both a description and a due date'));
    }

    const newTask = new Task({
      user: req.user.id,
      description,
      status: 'pending',
      dueDate: new Date(dueDate)
    });
    await newTask.save();
    res.redirect('/tasks?message=' + encodeURIComponent('Task created successfully'));
  } catch (err) {
    console.error(err);
    res.redirect('/tasks?error=' + encodeURIComponent('Could not create task'));
  }
});

// Update task status
router.put('/:id', jwtAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'completed' or 'deleted'
  try {
    await Task.updateOne({ _id: id, user: req.user.id }, { status });
    const successMessage = status === 'completed' ? 'Task completed successfully' : status === 'pending' ? 'Task reopened successfully' : 'Task updated successfully';
    res.redirect('/tasks?message=' + encodeURIComponent(successMessage));
  } catch (err) {
    console.error(err);
    res.redirect('/tasks?error=' + encodeURIComponent('Could not update task'));
  }
});

// Update task status from form submission
router.post('/:id', jwtAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status) {
      return res.redirect('/tasks?error=' + encodeURIComponent('No status was provided'));
    }

    await Task.updateOne({ _id: id, user: req.user.id }, { status });
    res.redirect('/tasks?message=' + encodeURIComponent(status === 'pending' ? 'Task reopened successfully' : 'Task updated successfully'));
  } catch (err) {
    console.error(err);
    res.redirect('/tasks?error=' + encodeURIComponent('Could not update task'));
  }
});

// Mark task as completed
router.patch('/:id/complete', jwtAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { status: 'completed' },
      { new: true }
    );

    if (!updatedTask) {
      return res.redirect('/tasks?error=' + encodeURIComponent('Task not found'));
    }

    const user = await User.findById(req.user.id);

    if (user) {
      sendNotification(req.user.id, {
        type: 'task_completed',
        message: `Great job! Your task "${updatedTask.description}" is now completed.`,
        taskId: updatedTask._id
      });

      if (user.email) {
        await sendEmail(
          user.email,
          'Task completed 🎉',
          `Hello ${user.username}, great work! Your task "${updatedTask.description}" has been completed successfully. Keep it up!`
        );
      }
    }

    return res.redirect('/tasks?message=' + encodeURIComponent('Task completed successfully'));
  } catch (err) {
    console.error(err);
    return res.redirect('/tasks?error=' + encodeURIComponent('Could not complete task'));
  }
});

// Delete task
router.post('/:id/delete', jwtAuth, async (req, res) => {
  const { id } = req.params;

  try {
    await Task.deleteOne({ _id: id, user: req.user.id });
    res.redirect('/tasks?message=' + encodeURIComponent('Task deleted successfully'));
  } catch (err) {
    console.error(err);
    res.redirect('/tasks?error=' + encodeURIComponent('Could not delete task'));
  }
});

module.exports = router;