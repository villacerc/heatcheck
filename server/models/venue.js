const mongoose = require('mongoose')

const Venue = mongoose.model('Venue', {
  name: {
    type: String,
    required: true
  },
  google_place_id: {
    type: String
  },
  address: {
    type: String
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  }
})

module.exports = { Venue }
