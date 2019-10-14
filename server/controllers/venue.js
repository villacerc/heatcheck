const axios = require('axios')

const getVenue = async (req, res) => {
  try {
    const venue = await db.Venue.scope('checkIns', 'games').findOne({
      where: {
        id: req.body.venueId
      }
    })

    res.status(200).json({ venue: venue.toJSON('getVenue') })
  } catch (err) {
    res.status(400).send({ err })
  }
}

const searchVenues = async (req, res) => {
  try {
    const query = req.body.query + ' basketball courts'
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_API_KEY}`

    initiateSearch(url, res)
  } catch (err) {
    res.status(400).send({ err })
  }
}

const getVenues = async (req, res) => {
  try {
    //need to search via geocode here based on front end cookies

    const venues = await db.Venue.scope('checkIns', 'games').findAll()

    res.status(200).json({ venues: sanitizeAll(venues) })
  } catch (err) {
    res.status(400).send({ err })
  }
}

const getGeocode = async place => {
  //get geocode of first result
  const { lat, lng } = place.geometry.location
  const geocode = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`

  const res = await axios.get(geocode)

  const { address_components } = res.data.results[0]

  //get locality, area and country
  const locality = address_components.find(({ types }) => {
    return types.find(type => type === 'locality')
  })
  const area = address_components.find(({ types }) => {
    return types.find(type => type === 'administrative_area_level_1')
  })
  const country = address_components.find(({ types }) => {
    return types.find(type => type === 'country')
  })

  if (locality) {
    place.locality = locality.long_name
    place.area = area.short_name
    place.country = country.long_name
  }

  return place
}

const geocodeResults = google_results => {
  const promises = google_results.map(async place => {
    return await getGeocode(place)
  })

  return Promise.all(promises)
}

const populateVenues = async (geocoded_results, location, isAsync = false) => {
  const { locality, area, country } = location

  //query DB for venues from location
  //so that we can check if place already exists within this scope only
  const venues = await db.Venue.scope('checkIns', 'games').findAll({
    where: {
      locality,
      area,
      country
    }
  })

  const place_ids = venues.map(venue => venue.google_place_id)

  // filter geocoded_results not in db_venues
  const toAdd = geocoded_results.filter(
    place => !place_ids.includes(place.place_id) && locality === place.locality
  )

  if (toAdd[0] && isAsync) {
    const promises = toAdd.map(async place => {
      await db.Venue.create({
        name: place.name,
        google_place_id: place.place_id,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        locality: place.locality,
        area: place.area,
        country: place.country
      })
    })

    await Promise.all(promises)

    //refetch venues
    return await db.Venue.scope('checkIns', 'games').findAll({
      where: {
        locality,
        area,
        country
      }
    })
  } else if (toAdd[0]) {
    toAdd.forEach(place => {
      db.Venue.create({
        name: place.name,
        google_place_id: place.place_id,
        address: place.formatted_address,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        locality: place.locality,
        area: place.area,
        country: place.country
      })
    })
  }

  return venues
}

const initiateSearch = async (url, res = null, location = null) => {
  const response = await axios.get(url)

  const geocoded_results = await geocodeResults(response.data.results)

  if (res) {
    //set location data
    const { locality, area, country } = geocoded_results.find(
      place => place.locality !== null
    )

    location = { locality, area, country }

    const venues = await populateVenues(geocoded_results, location, true)

    res.status(200).json({ venues: sanitizeAll(venues) })
  } else {
    populateVenues(geocoded_results, location)
  }

  if (response.data.next_page_token) {
    const { next_page_token } = response.data
    const nextPageUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${next_page_token}&key=${process.env.GOOGLE_API_KEY}`

    //there needs to be a short delay before the token is valid for use
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 2000)
    })

    initiateSearch(nextPageUrl, null, location)
  }
}

const sanitizeAll = venuesRaw => {
  const venues = JSON.parse(JSON.stringify(venuesRaw))

  return venues.map(venue => {
    venue.checkIns = venue.checkIns.length
    venue.games = venue.games.length

    return venue
  })
}
module.exports = { getVenues, getVenue, searchVenues }
