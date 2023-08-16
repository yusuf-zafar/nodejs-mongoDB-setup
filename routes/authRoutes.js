const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    googleLoginCallback,
    registerByOtp,
    verifyOtp,
} = require('../controller/authController');

// Google Authentication
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/auth/google/callback', googleLoginCallback);

// router.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });
router.route('/auth/send-otp').post(registerByOtp);
router.route('/auth/verify-otp').post(verifyOtp);
module.exports = router;
