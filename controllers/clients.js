const { CREATE_CLIENT_RULE, validationResult, getUserFrom } = require('../utils/requestParser')
const Client = require('../models/Clients')
const User = require('../models/User')
const { ERROR } = require('../utils/logger')

const ClientRouter = require('express').Router()

ClientRouter.post('/create', CREATE_CLIENT_RULE, async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, fullName, phone } = req.body

    const filter = {
        $or: [
            { fullName: { $exists: true }},
            { email: { $exists: true } },
            { customer: req.user.id }
        ]
    }

    const exists = await Client.exists(filter)
    if (exists) return res.status(400).json({ error: "Whoops! You already have a client with that email or name." })

    try {
        // Create a new client
        const newClient = new Client({
            email,
            fullName,
            phone,
            customer: req.user.id
        })

        // Save the client to the database
        await newClient.save();

        // Update the user's clients array with the new client's ID
        await User.updateOne(
            { _id: req.user.id },
            { $push: { clients: newClient._id } }
        )

        res.json({ message: 'Client created successfully!' });
    } catch (error) {
        await Client.deleteOne({ email })
        
        ERROR('Error creating client:', error.message);

        res.status(500).json({ error: 'Error creating client. Try again later.' });
    }
})

module.exports = ClientRouter