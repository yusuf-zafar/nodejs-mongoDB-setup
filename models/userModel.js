const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, "Company Name is required"],
    },
    position: {
        type: String,
        // required: [true, "Position is required"],
    },
    location: {
        type: String,
        // required: [true, "Location is required"],
    },
    workStartDate: {
        type: Date,
        // required: [true, "Work Start Date is required"],
    },
    workEndDate: {
        type: Date,
    },
    currentWork: {
        type: Boolean,
        default: false,
    },
    makeItPublic: {
        type: Boolean,
        default: false,
    },
});

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            // required: [true, 'Please Enter Your Name'],
            // maxLength: [30, 'Name Cannot Exceed 30 Characters'],
            // minLength: [4, 'Name should have more than 4 characters'],
        },
        googleId: {
            type: String,
            // required: [true, "Please Enter Your Email"],
            unique: true,
        },
        email: {
            type: String,
            // required: [true, "Please Enter Your Email"],
            // unique: true,
            // validate: [validator.isEmail, 'Please Enter a Valid Email'],
        },
        emailView: {
            type: String,
            enum: ['Only Me', 'Public'],
            // required: [true, "Please Specify the Email View"],
        },
        // password: {
        //   type: String,
        //   // required: [true, "Please Enter Your Password"],
        //   minLength: [8, "Password should be greater than 8 characters"],
        //   select: false,
        // },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            // required: [true, "Please Select Your Gender"],
        },
        horoscope: {
            type: String,
            enum: [
                'Aries',
                'Taurus',
                'Gemini',
                'Cancer',
                'Leo',
                'Virgo',
                'Libra',
                'Scorpio',
                'Sagittarius',
                'Capricorn',
                'Aquarius',
                'Pisces',
            ],
            // required: [true, "Please Enter Your Horoscope"],
        },
        religion: {
            type: String,
            // required: [true, "Please Enter Your Religion"],
        },
        address: {
            type: String,
            // required: [true, "Please Enter Your Current Address"],
        },
        addressView: {
            type: String,
            enum: ['Only Me', 'Public'],
            // required: [true, "Please Specify the Current Address View"],
        },
        number: {
            type: String,
            // required: [true, "Please Enter Your Phone Number"],
        },
        otp: {
            type: String,
        },
        otpExpiration: {
            type: Date,
            // 10 minutes
        },
        profilePhoto: {
            type: String,
            // required: [true, "Please Upload Your Profile Photo"],
        },
        relationshipStatus: {
            type: String,
            enum: ['unmarried', 'married'],
            // required: [true, "Please Specify Your Relationship Status"],
        },
        relationshipStatusView: {
            type: String,
            enum: ['Only Me', 'Public'],
            // required: [true, "Please Specify the Relationship Status View"],
        },
        marriedSince: {
            type: Date,
            required: function () {
                return this.relationshipStatus === 'married';
            },
            validate: {
                validator: function (value) {
                    if (this.relationshipStatus === 'married' && !value) {
                        return false;
                    }
                    return true;
                },
                message:
                    "marriedSince is required if relationshipStatus is 'married'",
            },
        },
        workStatus: {
            type: String,
            enum: ['employed', 'unemployed', 'student'],
            // required: [true, "Please Specify Your Work Status"],
        },
        workStatusView: {
            type: String,
            enum: ['Only Me', 'Public'],
            // required: [true, "Please Specify the Work Status View"],
        },
        companies: [
            {
                type: companySchema,
                validate: function (value) {
                    if (
                        this.workStatus === 'employed' &&
                        (!value || value.length === 0)
                    ) {
                        throw new Error(
                            'At least one company is required for employed workStatus'
                        );
                    }
                },
            },
        ],
    },
    { timestamps: true }
);

// userSchema.pre("save", async function(next){

//     if(!this.isModified("password")){
//         next();
//     }
//     this.password = await bcrypt.hash(this.password,10);
// });

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare password
// userSchema.methods.comparePassword = async function(enteredPassword){
//     return await bcrypt.compare(enteredPassword,this.password);
// };

module.exports = mongoose.model('user', userSchema);
