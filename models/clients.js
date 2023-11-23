const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client