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

const users = [
  {
    displayName: 'carlo',
    email: 'carlo@example.com',
    password: 'userOnePass'
  },
  {
    displayName: 'bob',
    email: 'bob@example.com',
    password: 'userTwoPass'
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

const populateUsers = done => {
  db.User.destroy({ where: {} })
    .then(() => {
      db.User.bulkCreate(users)
    })
    .then(() => done())
}

module.exports = { populateVenues, populateUsers }
