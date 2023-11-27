const express = require('express')
require('dotenv').config()
const app = express()
require('express-async-errors')
const cors = require('cors')

//Utilities
const { MONGODB_URI } = require('./utils/config')
const { INFO, ERROR } = require('./utils/logger')
const { errorHandler, unknownEndpoint, requestLogger, authMiddleware, flutterwaveWebhookMiddleware } = require('./utils/middleware')

//Routers
const LoginRouter = require('./controllers/login')
const UserRouter = require('./controllers/user')

//Database connection initiation
const mongoose = require('mongoose')
const AuthRouter = require('./controllers/auth')
const ClientRouter = require('./controllers/clients')
const InvoiceRouter = require('./controllers/invoice')
const ProductRouter = require('./controllers/products')
const WebhookRouter = require('./controllers/webhook')
const StripeRouter = require('./controllers/gateway/stripe')
mongoose.set("bufferTimeoutMS", 20000)

mongoose.set("strictQuery", false)

INFO(`Setting up connection to MongoDB...`)

mongoose.connect(MONGODB_URI)
        .then(() => INFO("Succesfully connected to MongoDB!"))
        .catch((error) => ERROR(`Error connecting to MongoDB 💣: ${error.message}`))

app.use(cors())
app.use(express.json())
app.use(requestLogger) //Logger to log request info to the console


//Routes
app.use('/api/user', UserRouter)
app.use('/api/login', LoginRouter)
app.use('/api/auth', authMiddleware, AuthRouter)
app.use('/api/clients', authMiddleware, ClientRouter)
app.use('/api/invoice', authMiddleware, InvoiceRouter)
app.use('/api/products', authMiddleware, ProductRouter)
app.use('/api/webhook', flutterwaveWebhookMiddleware, WebhookRouter)
app.use('/api/stripe/create-checkout-session', authMiddleware, StripeRouter)


app.use(errorHandler) 
app.use(unknownEndpoint)


module.exports = app
