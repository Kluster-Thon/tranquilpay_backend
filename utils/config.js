require('dotenv').config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.MONGODB_URI

const APP_URL = 'http://localhost:4500'

const SALT_ROUNDS = 10

module.exports = {
    PORT,
    MONGODB_URI,
    APP_URL,
    SALT_ROUNDS
}