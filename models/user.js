const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true 
  },
  businessName: {
    type: String,
    default: ""
  },
  passwordHash: String,
  confirmed: Boolean,
  fullName: {
    type: String,
    required: true
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User