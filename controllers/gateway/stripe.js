const Client = require('../../models/clients')
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
    
    const { products, clientId } = req.body

    const client = await Client.findById(clientId)
    if(!client) return res.json({ error: "Client not found, consider creating one first." })

    const { error, status } = await verifyProductAvailability(products.product_id, products.quantity)
    if (error) return res.status(status).json({ error })
    
    const line_items = products.map((prod) => ({
        price_data: {
            currency: "NGN",
            product_data: {
                name: prod.product_name,
            },
            unit_amount: Math.round(prod.price * 100)
        },
        quantity: products.quantity
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
            dueDate,
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