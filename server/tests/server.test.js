const expect = require('expect')
const request = require('supertest')

const app = require('../server')
const withSession = request.agent(app)
const {
  populateUsers,
  users,
  populateVenues,
  venues,
  populateGames,
  games,
  populateRequests
} = require('./seed')

//refresh collection with seeds
beforeEach(populateUsers)
beforeEach(populateVenues)
beforeEach(populateGames)
beforeEach(populateRequests)

const authenticateBefore = (user = null) => {
  before(done => {
    withSession
      .post('/api/login')
      .send(user || users[0])
      .end(done)
  })
}

const describeUnauthorized = (method, endpoint) => {
  describe('unauthorized', () => {
    it('should reject request if user not logged in', done => {
      switch (method) {
        case 'post':
          request(app)
            .post(endpoint)
            .expect(401)
        case 'get':
          request(app)
            .get(endpoint)
            .expect(401)
        case 'delete':
          request(app)
            .delete(endpoint)
            .expect(401)
        default:
      }
      done()
    })
  })
}

describe('POST /signup', () => {
  it('should create a user', done => {
    const newUser = {
      displayName: 'hello',
      email: 'hello@example.com',
      password: 'hello_there'
    }

    request(app)
      .post('/api/signup')
      .send(newUser)
      .expect(200)
      .expect(async res => {
        const fetchedUsers = await db.User.findAll()
        expect(fetchedUsers.length).toBe(users.length + 1)
      })
      .end(done)
  })

  it('should return validation errors if request invalid', done => {
    request(app)
      .post('/api/signup')
      .send({ email: 'hellexample.com', password: 'hello' })
      .expect(400)
      .end(done)
  })

  it('should not create user if email in use', done => {
    request(app)
      .post('/api/signup')
      .send(users[1])
      .expect(400)
      .end(done)
  })
})

describe('POST /login', () => {
  it('should log in the user', done => {
    request(app)
      .post('/api/login')
      .send(users[1])
      .expect(200)
      .end(done)
  })

  it('should reject user with invalid credentials', done => {
    request(app)
      .post('/api/login')
      .send({ email: 'geazy@gmail.com', password: 'hello' })
      .expect(401)
      .end(done)
  })
})

describe('GET /user', async () => {
  describe('sessionless', () => {
    it('should return null user if there is no session', done => {
      request(app)
        .get('/api/user')
        .expect(200)
        .expect(res => {
          const { user } = res.body
          expect(user).toBeNull()
        })
        .end(done)
    })
  })

  describe('session', () => {
    authenticateBefore()
    it('should return authenticated user', done => {
      withSession
        .get('/api/user')
        .expect(200)
        .expect(res => {
          const { user } = res.body
          expect(user.id).toBeTruthy()
          expect(user.displayName).toBe(users[0].displayName)
          expect(user.email).toBe(users[0].email)
        })
        .end(done)
    })
  })
})

describe('POST /logout', () => {
  describeUnauthorized('post', '/api/logout')

  describe('authorized', () => {
    authenticateBefore()
    it('should logout authenticated user', done => {
      withSession
        .post('/api/logout')
        .expect(200)
        .expect(() => {
          //check that user cleanup is perofmred
          db.User.scope('includeAll')
            .findByPk(users[0].id)
            .then(user => {
              expect(user.checkIn.venueId).toBeNull()
              expect(user.createdGame).toBeNull()
              expect(user.requestedGames.length).toBe(0)
            })
        })
        .end(done)
    })
  })
})

describe('POST /checkin', () => {
  describeUnauthorized('post', '/api/checkin')

  describe('authorized', () => {
    authenticateBefore()
    it('should check in the user to the venue', done => {
      withSession
        .post('/api/checkin')
        .send({ venueId: venues[0].id })
        .expect(200)
        .expect(async res => {
          const user = await db.User.scope('checkIn').findOne({
            where: { id: users[0].id }
          })
          expect(user.checkIn.venueId).toBe(venues[0].id)

          const venue = await db.Venue.scope('checkIns').findByPk(venues[0].id)
          expect(venue.checkIns[0].userId).toBe(user.id)
        })
        .end(done)
    })
  })
})

describe('GET /venues', () => {
  it('should get all venues', done => {
    request(app)
      .get('/api/venues')
      .expect(200)
      .expect(res => {
        expect(res.body.venues.length).toBe(3)
      })
      .end(done)
  })
})

describe('POST /create-game', () => {
  describeUnauthorized('post', '/api/create-game')

  describe('authorized', () => {
    authenticateBefore()
    it('should create a game', done => {
      const body = {
        venueId: venues[0].id,
        name: '5on5 Basketball',
        description: 'everyone welcome'
      }

      withSession
        .post('/api/create-game')
        .send(body)
        .expect(200)
        .expect(res => {
          //get last game
          const games = db.Game.findAll({
            limit: 1,
            order: [['createdAt', 'DESC']]
          })
          const requests = db.Request.findAll({
            where: { userId: users[0].id }
          })
          const user = db.User.scope('checkIn').findByPk(users[0].id)

          //have to use this method because there seems to be an issue with
          //subsequent fetches following a fetch that returns an array
          Promise.all([games, requests, user])
            .then(responses => {
              const game = responses[0][0]

              expect(game.userId).toBe(users[0].id)
              expect(game.venueId).toBe(body.venueId)
              expect(game.name).toBe(body.name)
              expect(game.description).toBe(body.description)

              const requests = responses[1]
              const request = requests.find(({ gameId }) => gameId == game.id)

              expect(request).toBeTruthy()

              const user = responses[2]

              expect(user.checkIn.venueId).toBe(body.venueId)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .end(done)
    })
  })
})

describe('GET /games', (req, res) => {
  it('should retrieve all games', done => {
    request(app)
      .get('/api/games')
      .expect(200)
      .expect(async res => {
        expect(res.body.games.length).toBe(games.length)
      })
      .end(done)
  })
})

describe('DELETE /delete-game', (req, res) => {
  describeUnauthorized('delete', '/api/delete-game')

  describe('authorized', () => {
    authenticateBefore()
    it('should delete a game by the user', done => {
      withSession
        .delete('/api/delete-game')
        .expect(200)
        .expect(async () => {
          const game = await db.Game.findOne({ where: { userId: users[0].id } })
          expect(game).toBeNull()

          //should delete all requests related to the game
          const requests = await db.Request.findAll({
            where: { gameId: games[0].id }
          })

          expect(requests.length).toBe(0)
        })
        .end(done)
    })
  })
})

describe('POST /invite-player', (req, res) => {
  describeUnauthorized('post', '/api/invite-player')

  describe('authorized', () => {
    authenticateBefore()
    it('should invite a player to the game', done => {
      withSession
        .post('/api/invite-player')
        .send({
          userId: users[1].id,
          gameId: games[0].id
        })
        .expect(200)
        .expect(async () => {
          const userInvited = await db.Request.findOne({
            where: { userId: users[1].id, gameId: games[0].id, type: 'invite' }
          })
          expect(userInvited).toBeTruthy()
        })
        .end(done)
    })
  })
})

describe('POST /join-game', (req, res) => {
  describeUnauthorized('post', '/api/join-game')

  describe('authorized', () => {
    authenticateBefore(users[1])
    it('should join a player to the game', done => {
      withSession
        .post('/api/join-game')
        .send({
          gameId: games[0].id
        })
        .expect(200)
        .expect(async () => {
          const userJoined = await db.Request.findOne({
            where: { userId: users[1].id, gameId: games[0].id, type: 'join' }
          })
          expect(userJoined).toBeTruthy()
        })
        .end(done)
    })
  })
})

describe('POST /accept-join-request', (req, res) => {
  describeUnauthorized('post', '/api/accept-join-request')

  describe('authorized', () => {
    authenticateBefore()
    it('should accept join request from player', done => {
      withSession
        .post('/api/accept-join-request')
        .send({
          userId: users[2].id,
          gameId: games[0].id
        })
        .expect(200)
        .expect(async () => {
          const userJoined = await db.Request.findOne({
            where: { userId: users[2].id, gameId: games[0].id, type: null }
          })
          expect(userJoined).toBeTruthy()
        })
        .end(done)
    })
  })
})

describe('POST /accept-invite', (req, res) => {
  describeUnauthorized('post', '/api/accept-invite')

  describe('authorized', () => {
    authenticateBefore()
    it('should accept invite from the game', done => {
      withSession
        .post('/api/accept-invite')
        .send({
          userId: users[3].id,
          gameId: games[0].id
        })
        .expect(200)
        .expect(async () => {
          const userJoined = await db.Request.findOne({
            where: { userId: users[3].id, gameId: games[0].id, type: null }
          })
          expect(userJoined).toBeTruthy()
        })
        .end(done)
    })
  })
})

describe('POST /leave-game', (req, res) => {
  describeUnauthorized('post', '/api/leave-game')

  describe('authorized', () => {
    const user = users[4]
    authenticateBefore(user)
    it('should leave a game', done => {
      withSession
        .post('/api/leave-game')
        .expect(200)
        .expect(async () => {
          const request = await db.Request.findOne({
            where: { userId: user.id }
          })

          expect(request).toBeNull()
        })
        .end(done)
    })
  })
})
