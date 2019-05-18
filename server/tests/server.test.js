const expect = require('expect')
const request = require('supertest')

const app = require('../server')
const { populateVenues } = require('./seed')

//refresh collection with seeds
beforeEach(populateVenues)

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
