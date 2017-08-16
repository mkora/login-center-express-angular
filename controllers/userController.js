const User = require('../models/User');
const validationSchemas = require('../validation/validationSchemas');

const jwt = require('jsonwebtoken');
const config = require('config');

exports.registerPost = function(req, res, next) {
  req.checkBody(validationSchemas.registrationSchema);
  req.getValidationResult().then(errors => {
    const {username,firstName, lastName, email, password} = req.body;
    const newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    });

    // validation errors
    if (!errors.isEmpty()) {
        const err = errors.array().shift();
        res.json({
          success: false,
          msg: `A validation error has occurred: ${err.msg}`
        });
    } else {
      // user already exists
      User.findUserByUsername(username, (err, user) => {
        if (err) return next(err);

        if (user) {
          res.json({
            success: false,
            msg: `The specified username '${username}' already exists.`
          });
        } else {
          // data is valid
          User.createUser(newUser, createdUser => {
            res.json({
              success: true,
              user: {
                username: createdUser.username,
                email: createdUser.email,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName
              },
              msg: `User ${username} was successfully created.`});
          });
        }
      });
    }

  });
}

exports.authPost = function(req, res, next) {
  req.checkBody(validationSchemas.loginSchema);
  req.getValidationResult().then(errors => {
    const {username, password} = req.body;
    // validation errors
    if (!errors.isEmpty()) {
        const err = errors.array().shift();
        res.json({
          success: false,
          msg: `A validation error has occurred: ${err.msg}`
        });
    } else {
      User.findUserByUsername(username, (err, user) => {
        if (err) return next(err);
        if (!user) {
          return res.json({
            success: false,
            msg: `Incorrect username.`
          });
        } else {
          User.isValidPassword(password, user.password, isMatch => {
            if (isMatch) {
              const token = 'JWT ' + jwt.sign({data: user}, config.get('secret'), {expiresIn: 60 * 60 * 24});

              res.json({
                success: true,
                tokren: token,
                user: {
                  username: user.username,
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName
                }
              });
            } else {
              return res.json({success: false,
                msg: `Incorrect password.`});
            }
          });
        }
      });
    }
  });
}

exports.profileGet = function(req, res, next) {
  res.json({
    success: true,
    user: req.user
  });
}
