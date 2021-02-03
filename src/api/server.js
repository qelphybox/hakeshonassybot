const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const app = express();
const authRouter = require('./routes/auth.router');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/api', (_req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);

// todo: delete after test
app.get('/test-auth', (req, res) => {
  res.sendFile(path.resolve(__dirname, './controllers/test-auth-pages/home.html'));
  res.status(200);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
  res.status(200);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
