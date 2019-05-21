const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

module.exports = app => {
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(cookieParser())
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })

  if (process.env.NODE_ENV === 'development') app.use(morgan('combined'))
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      store: new SequelizeStore({
        db: db.sequelize
      }),
      saveUninitialized: true
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
}
