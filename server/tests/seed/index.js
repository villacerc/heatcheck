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

requests = [
  {
    userId: 1,
    gameId: 1
  },
  {
    userId: 3,
    gameId: 1,
    type: 'join'
  },
  {
    userId: 4,
    gameId: 1,
    type: 'invite'
  }
]

const games = [
  {
    id: 1,
    userId: 1,
    venueId: 1,
    name: '2on2 Tennis'
  },
  {
    id: 2,
    name: '3on3 Basketball'
  },
  {
    id: 3,
    name: 'Chill soccer game'
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
  },
  {
    id: 3,
    displayName: 'kardi',
    email: 'kardi@example.com',
    password: 'keyboardcat'
  },
  {
    id: 4,
    displayName: 'bboy',
    email: 'bboy@example.com',
    password: 'keyboardcat'
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
  db.User.destroy({ where: {}, individualHooks: true })
    .then(() => {
      db.User.bulkCreate(users, { individualHooks: true })
    })
    .then(() => done())
}

const populateGames = done => {
  db.Game.destroy({
    where: {}
  })
    .then(() => {
      db.Game.bulkCreate(games)
    })
    .then(() => done())
}

const populateRequests = done => {
  db.Request.destroy({
    where: {}
  })
    .then(() => {
      db.Request.bulkCreate(requests)
    })
    .then(() => done())
}

module.exports = {
  populateVenues,
  venues,
  populateUsers,
  users,
  populateGames,
  games,
  populateRequests
}
