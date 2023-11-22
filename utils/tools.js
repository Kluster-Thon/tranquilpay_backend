const jwt = require("jsonwebtoken")


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

module.exports = {
    verifyTokenActive,
}