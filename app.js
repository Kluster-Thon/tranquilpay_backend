const app = require('express')()
const { PORT } = require('./utils/config')
const { INFO } = require('./utils/logger')

const LoginRouter = require('./controllers/login')

//Routes
app.use(LoginRouter)

module.exports = app
