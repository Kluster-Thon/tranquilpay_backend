const { body, validationResult } = require('express-validator')

const CREATE_USER_RULES = [
    body('email').notEmpty().isEmail().withMessage('Field is required and should be an email.'),
    body('password').notEmpty().isString().withMessage('FIeld is required and should be a string.')
]

module.exports = {
    CREATE_USER_RULES,
    validationResult
}