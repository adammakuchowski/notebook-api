import request from 'supertest'
import app from '../app'

describe('GET /sampleRouter/getSampleData', () => {
  it('responds with a sample data json', async () => {
    const response = await request(app)
      .get('/sampleRouter/getSampleData')
      .set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual([1, 2, 3])
  })
})

describe('POST /sampleRouter/createSampleData', () => {
  it('responds with a created sample data json', async () => {
    const sampleData = {
      id: '1',
      name: 'some name',
    }

    const response = await request(app)
      .post('/sampleRouter/createSampleData')
      .send(sampleData)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(sampleData.id)
    expect(response.body.name).toBe(sampleData.name)
  })
})
