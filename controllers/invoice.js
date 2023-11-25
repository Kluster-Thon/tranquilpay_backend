const InvoiceRouter = require('express').Router()
const { CREATE_INVOICE_RULES, validationResult } = require('../utils/requestParser')
const Invoice = require('../models/Invoice')
const { createTransactionUUID } = require('../utils/tools')
const ERROR = require('../utils/logger')
const { sendInvoiceTo } = require('../utils/emails')
const Client = require('../models/Clients')

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

InvoiceRouter.get('/verify/:invoiceNumber', async (req, res) => {
    const { invoiceNumber } = req.params

    const invoice = await Invoice.findOne({ number: invoiceNumber })

    if (!invoice) return res.status(400).json({ error: "No such invoice found." })

    if(invoice.status === "Paid") return res.json({ message: "Invoice has been paid." })

    res.json({ message: "Invoice found.", invoice })

})

InvoiceRouter.get('/fetch-all', async (req, res) => {
    const transactions = await Invoice.find({ userId: req.user.id })

    res.json({ transactions })
    
})

module.exports = InvoiceRouter