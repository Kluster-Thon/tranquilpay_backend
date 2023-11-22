const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require("../models/user")

const CREATE_USER_RULES = [
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
    body('password').notEmpty().isString().withMessage('FIeld is required and should be a string.')
]

const CHANGE_PASSWORD_RULES = [
    body('email').notEmpty().isEmail(),
    body('oldPassword').notEmpty().isString(),
    body('newPassword').notEmpty().isString(),
]

const FORGOT_PASSWORD_RULES = [
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
]

const RESET_FORGOT_PASSWORD_RULES = [
    body('password').notEmpty().isString().withMessage('FIeld is required and should be a string.')
]

const getUserFrom = async (req) => {
    const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
            const user = await User.findById(decodedToken.id)
            return user
        }
}

module.exports = {
    CREATE_USER_RULES,
    validationResult,
    CHANGE_PASSWORD_RULES,
    getUserFrom,
    FORGOT_PASSWORD_RULES,
    RESET_FORGOT_PASSWORD_RULES
}