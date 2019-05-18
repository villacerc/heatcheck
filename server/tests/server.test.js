const expect = require('expect')
const request = require('supertest')

const app = require('../server')
const { populateVenues, populateUsers } = require('./seed')

//refresh collection with seeds
beforeEach(populateVenues)
beforeEach(populateUsers)

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
        expect(res.body.id).toBeTruthy()
        expect(res.body.displayName).toBe(newUser.displayName)
        expect(res.body.email).toBe(newUser.email)
      })
      .end(done)
  })
})
