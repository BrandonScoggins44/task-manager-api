const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'brandon.scoggins44@gmail.com',
        subject: 'Thanks for joing Task App!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`       // back ticks are an alternative way to concatenate strings
        // html:        // Can include html if you like
    })
}

const cancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'brandon.scoggins44@gmail.com',
        subject: 'Sorry to see you go',
        text: `It was a pleasure working with you, ${name}, and I am sad to see you go! Please let me know how this app can be improved, so that you might reconsider?`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelationEmail
}