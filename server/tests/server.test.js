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
  games
} = require('./seed')

//refresh collection with seeds
beforeEach(populateUsers)
beforeEach(populateVenues)
beforeEach(populateGames)

const authenticateBefore = (user = null) => {
  before(done => {
    withSession
      .post('/api/login')
      .send(user || users[0])
      .end(done)
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
      .expect(res => {
        const { user } = res.body
        expect(user.id).toBeTruthy()
        expect(user.displayName).toBe(newUser.displayName)
        expect(user.email).toBe(newUser.email)
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
      .expect(res => {
        const { user } = res.body
        expect(user.id).toBeTruthy()
        expect(user.displayName).toBe(users[1].displayName)
        expect(user.email).toBe(users[1].email)
      })
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
  describe('with no session', () => {
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

  describe('with session', () => {
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

describe('POST /checkin', () => {
  describe('with no session', () => {
    it('should reject request if no session exist', done => {
      request(app)
        .post('/api/checkin')
        .send({ user: null, venueId: venues[0].id })
        .expect(400)
        .end(done)
    })
  })

  describe('with session', () => {
    authenticateBefore()
    it('should check in the user to the venue', done => {
      withSession
        .post('/api/checkin')
        .send({ user: users[0], venueId: venues[0].id })
        .expect(200)
        .expect(async res => {
          const { user } = res.body
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
  it('should create a game', done => {
    const body = {
      user: users[0],
      venueId: venues[0].id,
      name: '5on5 Basketball',
      description: 'everyone welcome'
    }

    request(app)
      .post('/api/create-game')
      .send(body)
      .expect(200)
      .expect(async res => {
        const { game } = res.body

        expect(game.userId).toBe(body.user.id)
        expect(game.venueId).toBe(body.venueId)
        expect(game.name).toBe(body.name)
        expect(game.description).toBe(body.description)
      })
      .end(done)
  })
})

describe('GET /games', (req, res) => {
  it('it should retrieve all games', done => {
    request(app)
      .get('/api/games')
      .expect(200)
      .expect(async res => {
        expect(res.body.games.length).toBe(games.length)
      })
      .end(done)
  })
})
