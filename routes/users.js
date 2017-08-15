const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const passport = require('passport');

router.get('/register', userController.registerGet);

router.post('/register', userController.registerPost);

router.get('/login', userController.loginGet);

router.post('/login', userController.loginPost,
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash : true
  })
);

router.get('/logout', userController.logoutGet);

router.get('/dashboard', passport.isLoggedInMiddleware, userController.dashboardGet);

module.exports = router;
