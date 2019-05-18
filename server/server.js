require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

require('./db/sequelize')
require('./services/passport')
require('./jobs')
const authenticate = require('./services/authenticate')

const app = express()
const port = process.env.PORT

const signUpController = require('./controllers/signUpController')
const verificationController = require('./controllers/verificationController')

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

app.use(morgan('combined'))
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

app.get('/api/venues', async (req, res) => {
  try {
    const venues = await db.Venue.findAll()
    res.send({ venues })
  } catch (e) {
    console.log(e)
  }
})

app.post('/api/checkin', async (req, res) => {
  try {
    if (req.user) {
      if (req.user.checkIn) {
        //check user out from current venue
        await db.CheckIn.destroy({ where: { userId: req.user.id } })
      }
      //check in to new venue
      await db.CheckIn.create({
        userId: req.user.id,
        venueId: req.body.venueId
      })

      const user = await db.User.findByPk(req.user.id)

      return res.status(200).send({ user })
    } else {
      return res.status(400).send()
    }
  } catch (e) {
    return res.status(400).send(e)
  }
})

app.get('/api/user', async (req, res) => {
  const user = req.isAuthenticated() ? req.user : null
  res.status(200).send({ user: user })
})

app.post('/api/login', authenticate)

app.get('/api/logout', function(req, res) {
  req.logout()
  res.status(200).send()
})

app.post('/api/verify', verificationController)

app.post('/api/signup', signUpController)

const server = app.listen(port, () => console.log(`listening on port ${port}!`))

const closeConnections = () => {
  db.sequelize.close()
  server.close()
}

//close db and app when terminating server
process.on('SIGINT', () => {
  closeConnections()
})
process.on('SIGTERM', () => {
  closeConnections()
})

module.exports = app
