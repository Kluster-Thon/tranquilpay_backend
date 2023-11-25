const { ERROR, INFO } = require("./logger")
const { getUserFrom } = require('./requestParser')
require('dotenv').config()

const errorHandler = (error, request, response, next) => {
    ERROR(error.message)

    if (error.name === "CastError") {
        return response.status(400).json({ error: "Malformatted id" })
        
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
        
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
        
    } else if (error.name ==='TokenExpiredError') {
        return response.status(401).json({ error: 'Token expired.' })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Unknown endpoint!" })
}

const requestLogger = (request, response, next) => {
    INFO(`Method: ${request.method} | Path: ${request.path} ${request.method === 'POST' ? `| ${JSON.stringify(request.body)}` : ''}`);
    next()
}

const authMiddleware = async (req, res, next) => {
    const authorizedUser = await getUserFrom(req)
    if (!authorizedUser) {
        return res.status(401).send({ error: "Unauthorized, login to continue." })
    }
    
    req.user = authorizedUser
    next()
}

const flutterwaveWebhookMiddleware = async (req, res, next) => {
    const secretHash = process.env.FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || (signature !== secretHash)) {
        // This request isn't from Flutterwave, discard.
        res.status(401).end();
    }

    next()
}

module.exports = {
    errorHandler,
    unknownEndpoint,
    requestLogger,
    authMiddleware,
    flutterwaveWebhookMiddleware
}