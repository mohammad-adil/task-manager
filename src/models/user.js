const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('Users', {
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Invalid Age")
            }
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        validate(value) {

            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email Address')
            }

        }
    },
    password: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        minlength: 6,
        maxlength: 16,

        validate(value) {
            if (value.includes('password')) {

                throw new Error('Password  cannot contain "Password" ')

            }


        }

    }

})

module.exports = User