const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const passport = require('passport');

router.post('/register', userController.registerPost);

router.post('/auth', userController.authPost);

router.get('/profile',
  passport.authenticate('jwt', { session: false }),
  userController.profileGet
);

module.exports = router;
