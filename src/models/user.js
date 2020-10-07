const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {


        user.password = await bcrypt.hash(user.password, 8)

    }

    next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User