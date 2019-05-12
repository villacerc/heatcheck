require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = (to, token) => {
  const hostUrl = process.env.HOST_URL
  const msg = {
    to,
    from: 'no-reply@pickandroll.com',
    subject: 'Pick and Roll - Verify Your Email',
    text: `Visit this link to verify your email ${hostUrl}/verification?token=${token}&email=${to}`,
    html: `<p style="font-size: 30px; font-weight: bold">Verification Code: <span style="font-weight: normal">${token}</span></p>`
  }

  sgMail.send(msg)
}
