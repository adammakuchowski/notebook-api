import request from 'supertest'
import app from '../app'

describe('GET /', () => {
  it('responds with a default server message', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.text).toBe('Every day you must ask yourself: Did you do enough?')
  })
})
