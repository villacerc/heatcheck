require('dotenv').config()
require('../db/mongoose')
const Venue = require('../models/venue')
const axios = require('axios')
const url =
  'https://maps.googleapis.com/maps/api/place/textsearch/json?query=basketball%20courts%20richmond%20bc+in+v6y2g3&key=AIzaSyBrUsX1qwbRw4ry4rodgUPG37qP-BxUMtQ'

axios
  .get(url)
  .then(async function(response) {
    const results = response.data.results

    results.forEach((place)=>{
      const venue = new Venue({
        name: place.name,
        google_place_id: place.place_id,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      })

      venue.save()
    })

  })
  .catch(function(error) {
    console.log(error)
  })