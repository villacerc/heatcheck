require('dotenv').config()
require('./db/mongoose')
const express = require('express')
const bodyParser = require('body-parser')

const Venue = require('./models/venue')

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

app.listen(port, () => {
  console.log(`Listening on port`, port)
})
