require('dotenv').config()
require('./db/mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')

const { Venue } = require('./models/venue')
const { User } = require('./models/user')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.get('/api/venues', async (req, res) => {
  try {
    const venues = await Venue.find({})
    res.send({ venues })
  } catch (e) {
    console.log(e)
  }
})

app.post('/api/signup', async (req, res) => {
  const body = _.pick(req.body, [
    'displayName',
    'email',
    'password',
    'confirmPassword'
  ])

  const newUser = new User(body)

  try {
    await newUser.save()
    res.send({ success: true })
  } catch (e) {
    res.status(400).send(e)
  }
})

app.listen(port, () => {
  console.log(`Listening on port`, port)
})
