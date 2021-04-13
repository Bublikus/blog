const request = require('supertest')
const app = require('../server')
const { isResponseOK } = require('./utils')

describe('Users route', () => {

  it('Get users by username should return an empty array', async () => {
    const res = await request(app).get('/api/users/*')
    isResponseOK(res)
    expect(res.body.data).toEqual([])
  })

})
