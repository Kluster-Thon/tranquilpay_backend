const jwt = require("jsonwebtoken")
const { v4 } = require('uuid')
const Invoice = require("../models/invoice")


const verifyTokenActive = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
    
        const currentTimestamp = Math.floor(Date.now() / 1000)
    
        if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
            throw new Error('Token expired')
        }
    
        return { active: true, email: decodedToken.email }
        
    } catch (error) {
        return { active: false, error: error.message };
    }

}

const createTransactionUUID = async () => {
    const uuid = v4()
    const exists = await Invoice.findOne({ number: uuid })
    if (exists) return createTransactionUUID()
    return uuid;
}

module.exports = {
    verifyTokenActive,
    createTransactionUUID,
}