const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

router.get('/me', authController.requireAuth, usersController.myprofile);
router.post('/signup', usersController.signup);
router.post('/signin', usersController.signin);

module.exports = router;
