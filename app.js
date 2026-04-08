const express = require('express');
const session = require('express-session');
const MongoStorePkg = require('connect-mongo');
const MongoStore = MongoStorePkg.default || MongoStorePkg;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./config/db');
  connectDB();
}

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: process.env.NODE_ENV === 'test' ? new session.MemoryStore() : MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Middleware to set user data in locals
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

// Routes
app.use('/auth', require('./routes/authentication'));
app.use('/tasks', require('./routes/taskRoutes'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

