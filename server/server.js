require('dotenv').config()
require('./db/mongoose')
const express = require('express')
const bodyParser = require('body-parser')

const Venue = require('./models/venue')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.get('/venues', async (req, res) => {
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
