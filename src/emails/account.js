const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'andradedeguilherme@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
  })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'andradedeguilherme@gmail.com',
    subject: 'Why did you cancel?',
    text: `Goodbye, ${name}. Could you let us know why did decide to cancel?`,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
}
