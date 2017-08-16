const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const validator = require('express-validator');

const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(cors());

app.use(validator());

app.use(passport.initialize());
app.use(passport.session());
require('./authentication/jwtPassport')(passport);

mongoose.Promise = global.Promise;
mongoose.connect(config.get('db.uri'), config.get('db.options'))
  .then(() => console.log(`Database connected at ${config.get('db.uri')}`))
  .catch(err => console.log(`Database connection error: ${err.message}`));

const index = require('./routes/index');
const users = require('./routes/users');
app.use('/', index);
app.use('/users', users);

// catch 404
app.use((req, res, next) => {
  res.status(404);
  res.json({error: `The requested resource couldn't be found`});
});

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  if (req.app.get('env') !== 'development') {
      delete err.stack;
  }
  // render the error page
  res.status(err.status || 500);
    console.error(err.stack);

  res.json({error:`An error has occurred, please try again later.`});
});

module.exports = app;
