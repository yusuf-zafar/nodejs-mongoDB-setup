const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

// update User Profile (fix code below)
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        emailView: req.body.emailView,
        gender: req.body.gender,
        horoscope: req.body.horoscope,
        religion: req.body.religion,
        address: req.body.address,
        addressView: req.body.addressView,
        phone: req.body.phone,
        profilePhoto: req.body.profilePhoto,
        relationshipStatus: req.body.relationshipStatus,
        relationshipStatusView: req.body.relationshipStatusView,
        marriedSince: req.body.marriedSince,
        workStatus: req.body.workStatus,
        workStatusView: req.body.workStatusView,
        companies: req.body.companies,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});
