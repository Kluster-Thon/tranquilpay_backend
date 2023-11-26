const User = require('../models/user');
const { ERROR, INFO } = require('../utils/logger');
const bcrypt = require('bcrypt');
const { CHANGE_PASSWORD_RULES, validationResult, EDIT_USER_PROFILE } = require('../utils/requestParser');
const { SALT_ROUNDS } = require('../utils/config');

const AuthRouter = require('express').Router()

AuthRouter.post('/change-password', CHANGE_PASSWORD_RULES, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, oldPassword, newPassword } = req.body

    const user = await User.findOne({ email })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(oldPassword, user.passwordHash)
    
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid email or password.'
        })
    }
    
    try {
        const password = await bcrypt.hash(newPassword, SALT_ROUNDS)

        await User.updateOne({ email }, { passwordHash: password })
        INFO('Password changed successfully')
        
        res.json({ message: "Password changed successfully! Proceed to login page." })
    } catch (error) {
        ERROR(`Error changing password: ${error.message}`)

        res.status(500).send({ message: `Error changing password. Try again later.`})
    }
})

AuthRouter.put('/update-profile', EDIT_USER_PROFILE, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.json({ errors: errors.array() })

    try {
        const result = await User.findOneAndUpdate({ _id: req.user.id }, { ...req.body })

        if(!result) return res.status(404).json({ "error": "User not found." })

        res.json({ message: "Profile updated successfully." })

    } catch (error) {
        ERROR(`Error updating user profile: ${error.message}`)

        res.status(500).json({ error: "Error updating profile, try again later." })
    }
    
})

module.exports = AuthRouter