const crypto = require('crypto-random-string')
const sendVerificationEmail = require('../services/sendVerificationEmail')

const signup = async (req, res) => {
  const { email } = req.body
  try {
    await db.User.create(req.body)
    const user = await db.User.findOne({ where: { email } })
    // const verification = await db.VerificationToken.create({
    //   userId: user.id,
    //   token: crypto({ length: 5 })
    // })
    // sendVerificationEmail(user.email, verification.token)
    return res.status(200).json({ user })
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error = 'An account with this email already exists'
    }
    return res.status(400).json({ error })
  }
}

const getUser = async (req, res) => {
  const user = req.isAuthenticated() ? req.user : null
  res.status(200).send({ user: user })
}

const logout = function(req, res) {
  req.logout()
  res.status(200).send()
}

module.exports = {
  signup,
  logout,
  getUser
}
