const passport = require('passport');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendOtp = require('../Utils/sendOtp');
const generateOtp = require('../Utils/generateOtp');
const bcrypt = require('bcryptjs');

exports.googleLoginCallback = catchAsyncErrors(async (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Google authentication failed.',
            });
        }

        sendToken(user, 200, res);
    })(req, res, next);
});

exports.registerByOtp = catchAsyncErrors(async (req, res, next) => {
    const number = req.body.number;
    if (!number) {
        return next(new ErrorHandler('Please provide your phone number', 422));
    }
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const existUser = await User.findOne({ number });
    let user;
    if (existUser) {
        existUser.otp = hashedOtp;
        existUser.otpExpiration = Date.now() + 5 * 60 * 1000;
        user = await existUser.save();
    } else {
        user = await User.create({
            number,
            otp: hashedOtp,
            otpExpiration: Date.now() + 10 * 60 * 1000,
        });
    }

    //send the otp here
    // const response = await sendOtp(number, otp);

    console.log({ otp });

    res.status(201).json({
        message: 'The 5 digits otp has been sent to your phone number',
        status: true,
        user,
    });
});

exports.verifyOtp = catchAsyncErrors(async (req, res, next) => {
    const { number, otp } = req.body;

    if (!number || !otp) {
        return next(
            new ErrorHandler('Please provide valid phone number and otp', 422)
        );
    }

    const user = await User.findOne({ number });
    if (!user) {
        return next(new ErrorHandler('Account does not exist', 400));
    }

    const validOtp = await bcrypt.compare(otp, user.otp);
    if (!validOtp || user.otpExpiration < Date.now()) {
        return next(
            new ErrorHandler(
                'The otp you entered is invalid or expired or used',
                400
            )
        );
    }
    user.otp = '';
    user.otpExpiration = '';
    await user.save();

    sendToken(user, 200, res);
});
