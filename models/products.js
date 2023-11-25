const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        lowercase: true,
    },
    unit_price: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    revenue: {
        type: Number,
        required: true,
    },
    percentage_increase: {
        type: Number,
        required: true,
        default: 1
    }
}, { timestamps: true })