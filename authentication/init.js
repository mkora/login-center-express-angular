const User = require('../models/User');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const isLoggedInMiddleware = require('./isLoggedInMiddleware');

// Configure sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findUserById(id, (err, user) => {
    done(err, user);
  });
});

// Configure authentication strategies
module.exports = function() {
  passport.use(new LocalStrategy((username, password, done) => {
    User.findUserByUsername(username, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      User.isValidPassword(password, user.password, isMatch => {
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }));

  passport.isLoggedInMiddleware = isLoggedInMiddleware;
}
