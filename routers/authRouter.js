const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router(); 
authRouter.get('/login', authController.getLogin);
authRouter.post('/login', authController.postLogin)
authRouter.post('/logout', authController.postLogout);
authRouter.get('/signup', authController.getSignup);
authRouter.post('/signup', authController.postSignup);
authRouter.get('/forgot-password', authController.getPassword);
authRouter.post('/forgot-password', authController.postPassword);
authRouter.get('/reset-password', authController.getResetPassword);
authRouter.post('/reset-password', authController.postResetPassword);


exports.authRouter = authRouter; 