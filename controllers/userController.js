const User = require('../models/User');
const validationSchemas = require('../validation/validationSchemas');

exports.registerGet = function(req, res, next) {
  res.render('register');
}

exports.registerPost = function(req, res, next) {
  req.checkBody(validationSchemas.registrationSchema);
  req.checkBody('confirm', 'Password do not match').equals(req.body.password);

  req.getValidationResult().then(errors => {
    const {username,firstName, lastName, email, password, confirm} = req.body;

    const newUser = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    });

    // validation errors
    if (!errors.isEmpty()) {
        res.render('register', {
            newUser: newUser,
            errors: errors.mapped()
        });
    } else {
      // user already exists
      User.findUserByUsername(username, (err, user) => {
        if (err) return next(err);

        if (user) {
          req.flash('error_msg', `The specified username '${username}' already exists.`);
          res.redirect('/users/register');

        } else {
          // data is valid
          User.createUser(newUser, createdUser => {
              req.flash('success_msg', `User ${username} was successfully created.`);
              res.redirect('/users/login');
          });
        }
      });
    }

  });
}

exports.loginGet = function(req, res, next) {
  res.render('login');
}

exports.loginPost = function(req, res, next) {
  req.checkBody(validationSchemas.loginSchema);
  req.getValidationResult().then(errors => {
    // validation errors
    if (!errors.isEmpty()) {
        res.render('login', {
            username: req.body.username,
            errors: errors.mapped()
        });
    } else {
      next();
    }
  });
}

exports.logoutGet = function(req, res, next) {
  req.logout();
  req.flash('success_msg', `You are logged out.`);
  res.redirect('/users/login');
}

exports.dashboardGet = function(req, res, next) {
  res.render('dashboard');
}
