require('dotenv').config()
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { APP_URL, FRONTEND_APP_URL } = require('./config')
const { ERROR, INFO } = require('./logger')
const User = require('../models/user')
const APP_MAIL = process.env.APP_MAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.APP_MAIL,
        pass: process.env.APP_MAIL_PASSWORD
    }
})

const createToken = (email, userId) => {
    const payload = {
        userId,
        email,
    };

    const options = {
        expiresIn: '1d',
        algorithm: 'HS256',
    };

    return jwt.sign(payload, process.env.SECRET, options);
}

const sendVerificationEmail = async (email, userId) => {
    // Create JWT with user ID as payload
    const token = createToken(email, userId)

    // Send email with verification link
    const verificationLink = `${APP_URL}/api/user/verify/${token}`;

    const emailOptions = {
        from: APP_MAIL,
        to: email,
        subject: 'Verify Your Email Address',
        text: `Please click on the following link to verify your email address: ${verificationLink}`,
    };

    try {
        await transporter.sendMail(emailOptions);
        INFO('Verification email sent successfully!')

        return { message: 'Registration successful. Please check your email to verify your account.' }
    } catch (error) {

        throw new Error(`Failed to send email: ${error.message}`)
    }

}

const sendResetPasswordEmail = async (email, userId) => {    
    const token = createToken(email, userId)

    //Send email with reset password link
    const resetPasswordLink = `${APP_URL}/api/user/reset-password/${token}`

    const emailOptions = {
        from: APP_MAIL,
        to: email,
        subject: 'Reset Your Password',
        text: `Please click on the following link to reset your password: ${resetPasswordLink}`,
    }

    try {
        await transporter.sendMail(emailOptions);
        INFO('Reset password email sent successfully!')

        return { message: 'Reset password email sent successfully. Please check your email to reset your password.' }
    } catch (error) {

        throw new Error(`Failed to send email: ${error.message}`)
    }
}

const sendInvoiceTo = async (email, invoiceNumber) => {
    const paymentLink = `${FRONTEND_APP_URL}/api/invoice/pay/${invoiceNumber}`

    const emailOptions = {
        from: APP_MAIL,
        to: email,
        subject: 'Payment invoice.',
        text: `Please click on the following link to make payment: ${paymentLink}`,
    }

    try {
        await transporter.sendMail(emailOptions)
        INFO('Invoice sent successfully!')

        return { message: 'Invoice sent successfully!' }
    } catch (error) {
        
        throw new Error(`Failed to send invoice: ${error.message}`)
    }
}

const verifyToken = async (token) => {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const email = decodedToken.email;

    try {
        await User.findOneAndUpdate({ email }, { confirmed: true })
        return { message: "Hurray! Email verified successfully." }
        
    } catch (error) {
        ERROR(`Failed to verify token: ${error.message}`)

        throw new Error(`Failed to verify token: ${error.message}`)
    }
}

module.exports = {
    createToken,
    sendVerificationEmail,
    verifyToken,
    sendResetPasswordEmail,
    sendInvoiceTo
}

