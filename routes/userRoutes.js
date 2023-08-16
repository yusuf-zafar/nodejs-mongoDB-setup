const express = require('express');
const {
    registerUser,
    loginUser,
    getUserDetails,
    updateProfile,
} = require('../Controller/userController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

router.route('/me').get(isAuthenticatedUser, getUserDetails);

router.route('/me/update').put(isAuthenticatedUser, updateProfile);

module.exports = router;
