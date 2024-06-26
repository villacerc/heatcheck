require('../db/sequelize')

const axios = require('axios')
const url =
  `https://maps.googleapis.com/maps/api/place/textsearch/json?query=basketball%20courts%20richmond%20bc+in+v6y2g3&key=${process.env.REACT_APP_GOOGLE_KEY}`

// need to run geocode here to populate locality, area and country
axios
  .get(url)
  .then(async function(response) {
    const results = response.data.results

    results.forEach(place => {
      db.Venue.create({
        name: place.name,
        google_place_id: place.place_id,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      })
    })
  })
  .catch(function(error) {
    console.log(error)
  })
