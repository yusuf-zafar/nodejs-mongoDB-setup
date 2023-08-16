const fast2sms = require('fast-two-sms');

async function sendOtp(number, code) {
    let options = {
        authorization: process.env.SMS_API_KEY,
        message: 'Your one-time-password is ' + code,
        numbers: [number],
    };

    return await fast2sms.sendMessage(options);
}

module.exports = sendOtp;
