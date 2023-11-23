const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: String,
    phone: String,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client