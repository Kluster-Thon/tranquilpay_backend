const User = require('../models/user');
const { CREATE_USER_RULES, validationResult } = require('../utils/requestParser');
const bcrypt = require('bcrypt')

const UserRouter = require('express').Router()

UserRouter.post('/create', CREATE_USER_RULES , async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        email,
        passwordHash,
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

module.exports = UserRouter