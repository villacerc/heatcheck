const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')

//determines which data of the user object should be stored in the session
passport.serializeUser((user, done) => {
  done(null, user.id)
})

//attach user to the request as req.user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.User.scope('includeAll').findByPk(id)
    return done(null, user.toJSON('includeAll'))
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
      const user = await db.User.scope('includeAll').findOne({
        where: { email }
      })

      //check password matches
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) done(null, false, { message: err })
          if (isMatch) {
            return done(null, user.toJSON('includeAll'))
          }
          return done(null, false, { message: 'Wrong password' })
        })
      } else {
        return done(null, false, { message: 'No user found' })
      }
    }
  )
)
