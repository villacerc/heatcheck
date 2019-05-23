const crypto = require('crypto-random-string')
const sendVerificationEmail = require('../services/sendVerificationEmail')
const passport = require('passport')

const authenticate = (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      return res.status(400).send({ flash: err })
    }
    if (!user) {
      return res.status(401).send({ flash: 'Incorrect email or password' })
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(400).send({ flash: err })
      }
      return res.status(200).json({ user })
    })
  })(req, res, next)
}

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
  getUser,
  authenticate
}
