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

const getVenues = async (req, res) => {
  try {
    const venues = await db.Venue.scope('checkIns', 'games').findAll()

    res.status(200).json({ venues: sanitizeAll(venues) })
  } catch (err) {
    res.status(400).send({ err })
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
module.exports = { getVenues, getVenue }
