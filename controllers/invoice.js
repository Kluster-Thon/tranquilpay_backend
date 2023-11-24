const InvoiceRouter = require('express').Router()
const { CREATE_INVOICE_RULES, validationResult } = require('../utils/requestParser')
const Invoice = require('../models/invoice')
const { createTransactionUUID } = require('../utils/tools')
const ERROR = require('../utils/logger')
const { sendInvoiceTo } = require('../utils/emails')
const Client = require('../models/clients')

InvoiceRouter.post('/create', CREATE_INVOICE_RULES, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    
    const { dueDate, totalAmount, items, clientEmail } = req.body

    const clientExists = await Client.findOne({ email: clientEmail })

    if (!clientExists) return res.status(400).json({
        error: "Client doesn't exist, consider creating one before creating an invoice."
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

        res.status(201).json({ message, createdInvoice })
        
    } catch (error) {
        await Invoice.deleteOne({ number })

        ERROR(`Error creating invoice: ${error.message}`)

        res.status(500).json({
            error: `Error creating invoice: ${error.message}`
        })
    }

})

InvoiceRouter.get('/pay/:invoiceNumber', async (req, res) => {
    
})

module.exports = InvoiceRouter