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
    body('email').notEmpty().withMessage('Field is required.').isEmail().withMessage('Field should be an email.'),
    body('phone').notEmpty().withMessage('Field is required').isMobilePhone('any', { strictMode: false }).withMessage('Field should be a mobile number.'),
]

const CREATE_INVOICE_RULES = [
    body('dueDate').notEmpty().withMessage('Field is required.').bail().isDate().withMessage('Invalid date format.').isAfter(new Date().toISOString()).withMessage('Date must be in the future.'),
    body('totalAmount').isNumeric().withMessage('Field is required and must be a number.'),
    body('clientEmail').isEmail().withMessage('Field should be an email.').bail().notEmpty().withMessage('Field is required and should be an email.'),
    body('items')
        .exists()
        .withMessage('Purchased items field is required.')
        .bail()
        .isArray()
        .withMessage('Purchased items field is required.')
        .bail()
        .custom(items => {
            for (const item of items) {
                if (!item.name || typeof item.name !== 'string') {
                    throw new Error('Invalid item name');
                }

                if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                    throw new Error('Invalid item quantity');
                }

                if (!item.unitPrice || typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
                    throw new Error('Invalid item unit price');
                }
            }

            return true;
        })
]

const CREATE_PRODUCT_RULES = [
    body('product_name').notEmpty().isString().withMessage('Field is required and should be a string.'),
    body('cost_price').notEmpty().isNumeric().withMessage('Field is required and should be a number.'),
    body('selling_price').notEmpty().isNumeric().withMessage('Field is required and should be a number.'),
    body('quantity').notEmpty().isNumeric().withMessage('Field is required and should be a number.'),
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
    EDIT_USER_PROFILE,
    CREATE_INVOICE_RULES,
    CREATE_PRODUCT_RULES
}