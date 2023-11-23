const User = require('../models/user');
const { SALT_ROUNDS } = require('../utils/config');
const { sendVerificationEmail, verifyToken, sendResetPasswordEmail } = require('../utils/emails');
const { ERROR, INFO } = require('../utils/logger');
const { CREATE_USER_RULES, validationResult, FORGOT_PASSWORD_RULES, RESET_FORGOT_PASSWORD_RULES } = require('../utils/requestParser');
const bcrypt = require('bcrypt')
const { verifyTokenActive } = require('../utils/tools');

const UserRouter = require('express').Router()

UserRouter.post('/create', CREATE_USER_RULES , async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, fullName } = req.body

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    
    try {

        const user = new User({
            email,
            passwordHash,
            fullName,
            confirmed: false
        })

        const savedUser = await user.save()

        const { message } = await sendVerificationEmail(email, savedUser._id)
        res.json({ message })

    } catch (error) {
        ERROR(error.message)

        // Rollback the transaction if any operation fails
        await User.deleteOne({ email })

        res.status(400).json({ error: error.message })

    }

})

UserRouter.get('/verify/:token', async (req, res) => {
    const token = req.params.token

    try {
        const { message } = await verifyToken(token)

        res.status(200).json({ message });

    } catch (error) {
        ERROR(error);

        res.status(400).send({ error: 'Invalid or expired verification token.' });
    }

})

UserRouter.post('/forgot-password', FORGOT_PASSWORD_RULES , async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email } = req.body

    const exists = await User.findOne({ email })
    if (!exists) {
        return res.status(401).json({ error: "No account with this email address." })
    }

    try {
        const { message } = await sendResetPasswordEmail(email)

        res.json({ message })
    } catch (error) {
        ERROR(`Failed to send email: ${error}`)

        res.status(400).json({ message: `Failed to send reset password email: ${error.message}`})
    }
})

UserRouter.get('/reset-password/:token', (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { token } = req.params

    try {
        verifyTokenActive(token)
        res.json({ message: "Token is active." })
        
    } catch (error) {
        res.json({ message: "Token has expired." })
    }
})

UserRouter.post('/reset-password/:token', RESET_FORGOT_PASSWORD_RULES, async (req, res) => {
    const { token } = req.params;

    const { password } = req.body

    try {
        const { active, email, error } = verifyTokenActive(token);

        if (!active) {
            return res.status(401).json({ error: 'Token is not active', details: error });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newPasswordHash = await bcrypt.hash(password, SALT_ROUNDS);
        user.passwordHash = newPasswordHash;
        await user.save();

        return res.json({ message: 'Password reset successfully' });
    } catch (error) {

        ERROR('Error resetting password:', error.message);

        return res.status(500).json({ error: 'Internal server error' });
    }

})

module.exports = UserRouter