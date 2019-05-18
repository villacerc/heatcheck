const venues = [
  {
    name: 'Waves Coffee'
  },
  {
    name: 'Stanley Park'
  },
  {
    name: 'South Arm Community'
  }
]

const populateVenues = done => {
  db.Venue.destroy({
    where: {},
    truncate: true
  })
    .then(() => {
      db.Venue.bulkCreate(venues)
    })
    .then(() => done())
}

module.exports = { populateVenues }
