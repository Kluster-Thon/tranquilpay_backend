require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.MONGODB_URI

const APP_URL = process.env.APP_URL

const SALT_ROUNDS = 10

const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL

module.exports = {
    PORT,
    MONGODB_URI,
    APP_URL,
    SALT_ROUNDS,
    FRONTEND_APP_URL
}