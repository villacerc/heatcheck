require('dotenv').config()
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = (to, token) => {
  const hostUrl = process.env.HOST_URL
  const msg = {
    to,
    from: 'pick-and-roll@pickandroll.com',
    subject: 'Pick and Roll - Verify Your Email',
    text: `Visit this link to verify your email ${hostUrl}/verify?token=${token}&email=${to}`,
    html: `<p style="color: #3c3c3c;
    font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;
    font-size: 16px;">Please confirm your email address by clicking on the link below.</p>
          <a href="${hostUrl}/verify?token=${token}&email=${to}" 
          style="box-sizing: border-box;
          border-color: #ff5722;
          font-weight: 400;
          text-decoration: none;
          display: inline-block;
          margin: 0;
          color: #ffffff;
          background-color: #ff5722;
          border: solid 1px #ff5722;
          border-radius: 2px;
          font-size: 14px;
          padding: 12px 45px;">
          Confirm Email Address</a>`
  }

  console.log('MESSSAGGE', msg)

  sgMail.send(msg)
}
