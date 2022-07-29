/* eslint-disable prettier/prettier */
const dynamoose = require('dynamoose')
const supertest = require('supertest')
const app = require('../app')
const BandSetlist = require('../models/bandsetlist')

// Define console functions so that they exist...
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}

const api = supertest(app)

describe('when there is initially one band at db', () => {
  beforeEach(async () => {
    dynamoose.aws.ddb.local()
    const bands = await BandSetlist.query('sk').eq('BAND').using('GSI1').exec()
    await Promise.all(
      bands.map(async (band) => {
        await band.delete()
      })
    )
    const band = {
      username: 'root',
      name: 'root band',
      password: 'sekret',
      securityQuestion: 'Question',
      securityAnswer: 'Answer',
    }
    await api.post('/api/bands').send(band)
  })

  test('login succeeds when valid username and password are given', async () => {
    const loginRequest = {
      username: 'root',
      password: 'sekret',
    }
    await api
      .post('/api/login')
      .send(loginRequest)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('reset fails with 401 and message if password does not match that of existing band', async () => {
    const loginRequest = {
      username: 'root',
      password: 'sekret2',
    }
    const result = await api
      .post('/api/login')
      .send(loginRequest)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('invalid username or password')
  })

  test('reset fails with 401 and message if username is not found', async () => {
    const loginRequest = {
      username: 'aStrangeUsername',
      password: 'sekret2',
    }
    const result = await api
      .post('/api/login')
      .send(loginRequest)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('invalid username or password')
  })
})

afterAll(() => {
  if (dynamoose.connection) {
    dynamoose.connection.close()
  }
})
