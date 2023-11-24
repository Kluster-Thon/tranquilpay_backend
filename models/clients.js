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

clientSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client