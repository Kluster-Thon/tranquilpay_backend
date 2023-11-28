const { default: mongoose } = require('mongoose')
const Client = require('../../models/clients')
const Invoice = require('../../models/invoice')
const { sendInvoiceTo } = require('../../utils/emails')
const { ERROR } = require('../../utils/logger')
const { STRIPE_CHECKOUT_RULES, validationResult } = require('../../utils/requestParser')
const { verifyProductAvailability } = require('../../utils/tools')

require('dotenv').config()
const StripeRouter = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

StripeRouter.post('/create-checkout-session', STRIPE_CHECKOUT_RULES, async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.json({ errors: errors.array() })
    
    const { productsToBuy, clientId } = req.body

    const client = await Client.findById(clientId)
    if (!client) return res.json({ error: "Client not found, consider adding them first." })
    
    const availableProducts = await Promise.all(productsToBuy.map(async (item) => {
        const { error, status, product } = await verifyProductAvailability(item.product_id, item.quantity)
        if (error) return res.status(status).json({ error })
        
        return product
    }))
    
    const line_items = availableProducts.map((product) => ({
        price_data: {
            currency: "NGN",
            product_data: {
                name: product.product_name,
            },
            unit_amount: Math.round(product.cost_price / product.quantity)
        },
        quantity: product.quantityForPurchase
    }))

    const items = availableProducts.map(item => ({
        product_id: item.id,
        name: item.product_name,
        quantity: item.quantityForPurchase,
        unitPrice: Math.round(product.cost_price / product.quantity),
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: "payment",
        success_url: "",
        cancel_url: ""
    })

    try {

        const newInvoice = new Invoice({
            number: await createTransactionUUID(),
            userId: req.user.id,
            clientId: clientExists._id,
            totalAmount,
            items,
        })

        const createdInvoice = await newInvoice.save()

        const { message } = await sendInvoiceTo(clientEmail, createdInvoice.number)

        res.status(201).json({ message, createdInvoice, sessionId: session.id })
        
    } catch (error) {
        await Invoice.deleteOne({ number })

        ERROR(`Error creating invoice: ${error.message}`)

        res.status(500).json({
            error: `Error creating invoice: ${error.message}`
        })
    }

})

module.exports = StripeRouter