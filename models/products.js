const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        lowercase: true,
    },
    cost_price: {
        type: Number,
        required: true,
        default: 0
    },
    selling_price: {
        type: Number,
        required: true,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    total_selling_price: {
        type: Number,
        required: true,
        default: 0
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
    // percentage_increase: {
    //     type: Number,
    //     required: true,
    //     default: 1
    // }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

module.exports = Product