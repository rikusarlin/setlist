/* eslint-disable prettier/prettier */
const dynamoose = require('dynamoose')
const supertest = require('supertest')
const helper = require('./bands_test_helper')
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
    const band = new BandSetlist({
      pk: 'BAND-root',
      sk: 'BAND',
      data: 'BAND-root',
      name: 'Roots',
      username: 'root',
      password: 'sekret',
      securityQuestion: 'Question',
      securityAnswer: 'Answer',
    })
    await band.save()
  })

  test('bands can be successfully read', async () => {
    const response = await api.get('/api/bands')
    expect(response.statusCode).toBe(200)
    expect(response.body[0].username).toBe('root')
  })
  test('creation succeeds with a fresh username', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const addedBand = await api
      .post('/api/bands')
      .send(helper.newBand)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log(addedBand)
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length + 1)
    const usernames = bandsAtEnd.map((u) => u.username)
    expect(usernames).toContain(helper.newBand.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
      securityQuestion: 'Question 1',
      securityAnswer: 'Answer 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('band with that name already exists')
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })

  test('creation fails with 400 and message if username is not present', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      name: 'Superuser',
      password: 'salainen',
      securityQuestion: 'Question 1',
      securityAnswer: 'Answer 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('missing username')
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })

  test('creation fails with 400 and message if username is less than 3 chars', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
      securityQuestion: 'Question 1',
      securityAnswer: 'Answer 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length'
    )
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })

  test('creation fails with 400 and message if password is not present', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      username: 'root2',
      name: 'Superuser',
      securityQuestion: 'Question 1',
      securityAnswer: 'Answer 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`password` is required')
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })

  test('creation fails with 400 and message if password is less than 3 chars', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      username: 'root2',
      name: 'Superuser',
      password: 'sa',
      securityQuestion: 'Question 1',
      securityAnswer: 'Answer 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length'
    )
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })

  test('creation fails with 400 and message if sequrity question is not given', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      username: 'root2',
      name: 'Superuser',
      password: 'salainen',
      securityAnswer: 'Answer 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`securityQuestion` is required')
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })

  test('creation fails with 400 and message if sequrity answer is not given', async () => {
    const bandsAtStart = await helper.bandsInDb()
    const newBand = {
      username: 'root2',
      name: 'Superuser',
      password: 'salainen',
      securityQuestion: 'Question 1',
    }
    const result = await api
      .post('/api/bands')
      .send(newBand)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`securityAnswer` is required')
    const bandsAtEnd = await helper.bandsInDb()
    expect(bandsAtEnd.length).toBe(bandsAtStart.length)
  })
})

afterAll(() => {
  if (dynamoose.connection) {
    dynamoose.connection.close()
  }
})
