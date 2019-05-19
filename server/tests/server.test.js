const expect = require('expect')
const request = require('supertest')

const app = require('../server')
const withSession = request.agent(app)
const { populateUsers, users, populateVenues } = require('./seed')

//refresh collection with seeds
beforeEach(populateUsers)
beforeEach(populateVenues)

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
