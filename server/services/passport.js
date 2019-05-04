const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    return done(null, user)
  } catch (e) {
    return done(null, e)
  }
})

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const query = { email }
    User.findOne(query, (err, user) => {
      if (err) throw err
      if (!user) {
        return done(null, false, { message: 'No user found' })
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, { message: 'Wrong password' })
      })
    })
  })
)
