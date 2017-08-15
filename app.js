const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const flash = require('connect-flash');
const session = require('express-session');
const validator = require('express-validator');

const config = require('config');

const mongoose = require('mongoose');

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

app.use(session({
  secret: config.get('cookie.secret'),
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

require('./authentication').init(app);

mongoose.Promise = global.Promise;
mongoose.connect(config.get('db.uri'), config.get('db.options'))
  .then(() => console.log(`Database connected at ${config.get('db.uri')}`))
  .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

const index = require('./routes/index');
const users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
