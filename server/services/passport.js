const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.findByPk(id)
    return done(null, user.get())
  } catch (e) {
    return done(null, e)
  }
})

passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      const user = await db.User.findOne({
        where: { email }
      })

      //check password matches
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          }
          return done(null, false, { message: 'Wrong password' })
        })
      } else {
        return done(null, false, { message: 'No user found' })
      }
    }
  )
)
