require('dotenv').config();

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');

const {initializeWebSocket} = require('./websocket');


if (process.env.NODE_ENV !== 'test') {
  const connectDB = require('./config/db');
  connectDB();
  //Cron job starts
  require('./cron/overdueTask')
}

const app = express();

const server = http.createServer(app);

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}


// Routes
app.use('/auth', require('./routes/authentication'));
app.use('/tasks', require('./routes/taskRoutes'));

app.get('/', (req, res) => {
  res.render('index');
});

initializeWebSocket(server);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
