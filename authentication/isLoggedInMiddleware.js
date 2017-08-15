module.exports = function isLoggedInMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }

  req.flash('error_msg', `You're not logged in.`);
  res.redirect('/');
}
