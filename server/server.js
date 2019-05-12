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
    secret: 'keyboard cat',
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
    const venues = await Venue.find({})
    res.send({ venues })
  } catch (e) {
    console.log(e)
  }
})

app.post('/api/checkin', async (req, res) => {
  const body = _.pick(req.body, ['venueId'])
  if (req.user) {
    if (req.user.checkedInTo) {
      //check user out from current venue
      await Venue.findOneAndUpdate(
        { _id: req.user.checkedInTo },
        { $pull: { checkIns: { user: req.user._id } } }
      )
    }
    //check in to new venue
    await Venue.findOneAndUpdate(
      { _id: body.venueId },
      { $push: { checkIns: { user: req.user._id } } }
    )
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { checkedInTo: body.venueId },
      { new: true }
    )

    return res.status(200).send({ user })
  }
  return res.status(400).send()
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

// app.post('/api/signup', async (req, res, next) => {
//   const body = _.pick(req.body, ['displayName', 'email', 'password'])

//   try {
//     await db.User.create(body)
//     authenticate(req, res, next)
//   } catch (error) {
//     if (error.name === 'SequelizeUniqueConstraintError') {
//       error = 'An account with this email already exists'
//     }
//     res.status(400).send({ error })
//   }
// })

app.listen(port, () => {
  console.log(`Listening on port`, port)
})
