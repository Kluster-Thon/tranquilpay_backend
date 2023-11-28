const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const invoiceSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        default: "Unpaid"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true,
        default: 0
    },
    items: [
        {
            "product_id": {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            "name": String,
            "quantity": Number,
            "unitPrice": Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

invoiceSchema.plugin(uniqueValidator)

invoiceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice