const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const { sendNotification } = require('../websocket');

cron.schedule('* * * * *', async () => {
  try {
    const tasks = await Task.find({ status: 'pending', dueDate: { $lt: new Date() } });

    for (const task of tasks) {
      task.status = 'overdue';
      await task.save();

      const user = await User.findById(task.user);
      if (!user) continue;

      sendNotification(user._id, {
        type: 'overdue',
        message: `Your task "${task.description}" is overdue.`,
        task
      });

      if (user.email) {
        await sendEmail(
          user.email,
          'Task Overdue',
          `Hello ${user.username}, your task "${task.description}" is now overdue. Please complete it as soon as possible.`
        );
      }
    }
  } catch (err) {
    console.error('Cron Job Error:', err.message);
  }
});

console.log('Overdue task scheduler started.');