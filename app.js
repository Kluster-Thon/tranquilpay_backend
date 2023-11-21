const express = require('express')
require('dotenv').config()
const app = express()
require('express-async-errors')
const cors = require('cors')
const { MONGODB_URI } = require('./utils/config')
const { INFO, ERROR } = require('./utils/logger')
const LoginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const UserRouter = require('./controllers/user')
mongoose.set("bufferTimeoutMS", 20000)

mongoose.set("strictQuery", false)

INFO(`Setting up connection to MongoDB...`)

//Initiating MongoDB connection.
mongoose.connect(MONGODB_URI)
        .then(() => INFO("Succesfully connected to MongoDB!"))
        .catch((error) => ERROR("Error connecting to MongoDB 💣:", error.message))

app.use(cors())
app.use(express.json())

//Routes
app.use('/api/user', UserRouter)
app.use('/api/login', LoginRouter)


module.exports = app
