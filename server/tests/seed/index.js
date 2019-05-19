const venues = [
  {
    id: 1,
    name: 'Waves Coffee'
  },
  {
    id: 2,
    name: 'Stanley Park'
  },
  {
    id: 3,
    name: 'South Arm Community'
  }
]

const users = [
  {
    id: 1,
    displayName: 'carlo',
    email: 'carlo@example.com',
    password: 'userOnePass'
  },
  {
    id: 2,
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
      db.User.bulkCreate(users, { individualHooks: true })
    })
    .then(() => done())
}

module.exports = { populateVenues, venues, populateUsers, users }
