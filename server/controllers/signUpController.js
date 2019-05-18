const crypto = require('crypto-random-string')
const sendVerificationEmail = require('../services/sendVerificationEmail')
const _ = require('lodash')

module.exports = async (req, res, next) => {
  const body = _.pick(req.body, ['displayName', 'email', 'password'])
  try {
    const user = await db.User.create(body)
    const verification = await db.VerificationToken.create({
      userId: user.id,
      token: crypto({ length: 5 })
    })
    sendVerificationEmail(user.email, verification.token)
    return res.status(200).json(user)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error = 'An account with this email already exists'
    }
    return res.status(400).json({ error })
  }
}
