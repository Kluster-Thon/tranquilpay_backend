const jwt = require("jsonwebtoken")
const { v4 } = require('uuid')
const Invoice = require("../models/invoice")
const Products = require("../models/products")
const cron = require('node-cron');


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

// function percentageIncrease(oldValue, newValue) {
//     const increaseAmount = newValue - oldValue;
//     const percentageIncrease = (increaseAmount / oldValue) * 100;
//     return percentageIncrease;
// }

async function resetData() {
    const { product_name } = Products.findAll();
    const defaultValues = {
        cost_price: 0,
        selling_price: 0,
        quantity: 1,
        total_selling_price: 0,
        deleted: false,
        revenue: 0,
    };
    try {
        const resetProducts = await Products.updateMany({}, {
            $unset: { [product_name]: 1 },
            $set: { ...defaultValues },
        });
        res.status(200).json({ message: 'Data reset successfully', data: resetProducts });
        console.log('Data reset successfully');
    } catch (error) {
        console.error('Error resetting data:', error);
    }
}

cron.schedule('1 0 * * *', () => {
    const now = moment();
    const midnight = moment().startOf('day').add(1, 'day');

    if (now.isAfter(midnight)) {
        resetData();
    }
});

module.exports = {
    verifyTokenActive,
    createTransactionUUID,
    // percentageIncrease
}