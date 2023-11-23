const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require("../models/user")

const CREATE_USER_RULES = [
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
    body('password').notEmpty().isString().withMessage('Field is required and should be a string.'),
    body('fullName').notEmpty().isString().withMessage('Field is required and should be a string.'),
]

const LOGIN_USER_RULES = [
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
    body('password').notEmpty().isString().withMessage('Field is required and should be a string.'),
]

const CHANGE_PASSWORD_RULES = [
    body('email').notEmpty().isEmail(),
    body('oldPassword').notEmpty().isString(),
    body('newPassword').notEmpty().isString(),
]

const FORGOT_PASSWORD_RULES = [
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
]

const EDIT_USER_PROFILE = [
    body('fullName').optional().isString().withMessage('Field should be letters.'),
    body('email').optional().isEmail().withMessage('Field should be an email.'),
    body('businessName').optional().isString().withMessage('Field should be letters.')
]

const RESET_FORGOT_PASSWORD_RULES = [
    body('password').notEmpty().isString().withMessage('Field is required and should be a string.')
]

const CREATE_CLIENT_RULE = [
    body('fullName').notEmpty().isString().withMessage('Field is required and should be a string.'),
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
    body('phone').notEmpty().isNumeric().withMessage('Field is required and should be a number.'),
]

const getUserFrom = async (req) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        return user && user
    }
}

module.exports = {
    CREATE_USER_RULES,
    validationResult,
    CHANGE_PASSWORD_RULES,
    getUserFrom,
    FORGOT_PASSWORD_RULES,
    RESET_FORGOT_PASSWORD_RULES,
    CREATE_CLIENT_RULE,
    LOGIN_USER_RULES,
    EDIT_USER_PROFILE
}