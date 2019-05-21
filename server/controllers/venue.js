const getVenues = async (req, res) => {
  try {
    const venues = await db.Venue.scope('checkIns').findAll()
    res.send({ venues })
  } catch (e) {
    console.log(e)
  }
}

module.exports = { getVenues }
