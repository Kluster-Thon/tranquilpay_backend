const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const LoginRouter = require('express').Router()
const User = require('../models/user')
const { CREATE_USER_RULES, validationResult } = require('../utils/requestParser')

LoginRouter.post('/', CREATE_USER_RULES, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  const { email, password } = req.body

  const user = await User.findOne({ email })
  const passwordCorrect = user === null
    ? false
    : bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid email or password.'
    })
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 }
  )

  res
    .status(200)
    .send({ token, email: user.email, businessName: user.businessName })
})

module.exports = LoginRouter