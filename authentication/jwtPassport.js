const User = require('../models/User');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('config');

// Configure authentication strategies
module.exports = function(passport) {
  const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.get('secret')
  };
  passport.use(new JwtStrategy(jwtOpts, function(jwtPayload, done) {
    User.findUserById(jwtPayload.data._id, function(err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}
