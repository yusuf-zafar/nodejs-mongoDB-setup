const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config({path: "./config/config.env"});

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     User.findById(id).then((user) => {
//         done(null, user);
//     }).catch((err) => {
//         done(err, null);
//     });
// });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true
}, async (req,accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        // console.log(profile)
        if (!user) {
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                // You can store other necessary fields from the profile
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));
