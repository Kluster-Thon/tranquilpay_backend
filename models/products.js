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
    },
    selling_price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    total_selling_price: {
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
    // percentage_increase: {
    //     type: Number,
    //     required: true,
    //     default: 1
    // }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

module.exports = Product