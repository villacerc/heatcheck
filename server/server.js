require('dotenv').config()
require('./db/mongoose')
require('./services/passport')

const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session)
const morgan = require('morgan')

const Venue = require('./models/venue')
const User = require('./models/user')
const authenticate = require('./services/authenticate')

const app = express()
const port = process.env.PORT

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
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/api/venues', async (req, res) => {
  try {
    const venues = await Venue.find({})
    res.send({ venues })
  } catch (e) {
    console.log(e)
  }
})

app.get('/api/user', async (req, res) => {
  const user = req.isAuthenticated() ? req.user : null

  res.status(200).send({ user: user })
})

app.post('/api/login', authenticate)

app.post('/api/signup', async (req, res, next) => {
  const body = _.pick(req.body, [
    'displayName',
    'email',
    'password',
    'confirmPassword'
  ])

  try {
    const newUser = new User(body)
    await newUser.save()

    passport.authenticate('local', (err, user, info) => {
      let status = null
      let send = ''

      if (err) {
        status = 400
        send = { error: err }
      }
      if (!user) {
        status = 400
        send = { message: 'No user found' }
      }
      req.logIn(user, function(err) {
        if (err) {
          status = 400
          send = { error: err }
        }
        status = 200
      })
      return res.status(status).send(send)
    })(req, res, next)
  } catch (e) {
    res.status(400).send({ error: e })
  }
})

app.listen(port, () => {
  console.log(`Listening on port`, port)
})
