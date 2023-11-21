const app = require('express')()
const { PORT, MONGODB_URI } = require('./utils/config')
const { INFO, ERROR } = require('./utils/logger')
const LoginRouter = require('./controllers/login')
const mongoose = require('mongoose')
mongoose.set("bufferTimeoutMS", 20000)

mongoose.set("strictQuery", false)

INFO("Connecting to", MONGODB_URI)

//Initiating MongoDB connection.
mongoose.connect(MONGODB_URI)
        .then(() => INFO("Succesfully connected to MongoDB!"))
        .catch((error) => ERROR("Error connecting to MongoDB 💣:", error.message))

//Routes
app.use(LoginRouter)

module.exports = app
