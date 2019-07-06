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
    req.logIn(user, async err => {
      if (err) {
        return res.status(400).send({ flash: err })
      }

      //check user in
      if (req.body.venueId) {
        await db.CheckIn.update(
          { venueId: req.body.venueId },
          { where: { userId: user.id } }
        )
      }

      return res.status(200).json({ user })
    })
  })(req, res, next)
}

const bgColors = [
  '#F44336',
  '#FFC107',
  '#3F51B5',
  '#9C27B0',
  '#009688',
  '#607D8B'
]

const signup = async (req, res) => {
  const { email } = req.body
  try {
    //pick random color
    const i = Math.floor(Math.random() * bgColors.length - 1)

    await db.User.create({ ...req.body, color: bgColors[i] })
    // const verification = await db.VerificationToken.create({
    //   userId: user.id,
    //   token: crypto({ length: 5 })
    // })
    // sendVerificationEmail(user.email, verification.token)
    authenticate(req, res)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      error = 'An account with this email already exists'
    }
    return res.status(400).json({ error })
  }
}

const getUser = async (req, res) => {
  const user = req.isAuthenticated() ? req.user : null
  res.status(200).send({ user })
}

const logout = async (req, res) => {
  //perform cleanup
  if (req.user.checkIn.venueId) {
    await db.CheckIn.update(
      { venueId: null },
      { where: { userId: req.user.id } }
    )
  }
  if (req.user.createdGame) {
    const game = await db.Game.findOne({ where: { userId: req.user.id } })
    game.destroy()
  }
  await db.Request.destroy({ where: { userId: req.user.id } })

  req.logout()
  res.status(200).send()
}

module.exports = {
  signup,
  logout,
  getUser,
  authenticate
}
