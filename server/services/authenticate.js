const passport = require('passport')

module.exports = function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(400).send({ error: err })
    }
    if (!user) {
      return res.status(401).send({ message: 'Incorrect email or password' })
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(400).send({ error: err })
      }
      return res.status(200).send({ user: user })
    })
  })(req, res, next)
}
