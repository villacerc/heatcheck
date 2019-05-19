const passport = require('passport')

module.exports = function(req, res, next) {
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
