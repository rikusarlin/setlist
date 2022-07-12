/* eslint-disable prettier/prettier */
const dynamoose = require('dynamoose')
const supertest = require('supertest')
const app = require('../app')
const Band = require('../models/band')
const bcrypt = require('bcrypt')

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
    const bands = await Band.scan().exec()
    bands.map((band) => Band.delete(band.username))
    const saltRounds = 10
    const password = 'sekret'
    const securityAnswer = 'Answer'
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const securityAnswerHash = await bcrypt.hash(securityAnswer, saltRounds)
    const band = new Band({
      name: 'Roots',
      username: 'root',
      password: password,
      securityQuestion: 'Question',
      securityAnswer: 'Answer',
      securityAnswerHash,
      passwordHash,
    })
    await band.save()
  })
  test('reset succeeds when valid new password and security answer are given', async () => {
    const resetRequest = {
      username: 'root',
      newPassword: 'sekret2',
      securityAnswer: 'Answer',
    }
    await api
      .post('/api/reset')
      .send(resetRequest)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('reset fails with 401 and message if username is not present', async () => {
    const resetRequest = {
      newPassword: 'sekret2',
      securityAnswer: 'Answer',
    }
    const result = await api
      .post('/api/reset')
      .send(resetRequest)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('invalid username or security answer')
  })

  test('reset fails with 400 and message if new password is not present', async () => {
    const resetRequest = {
      username: 'root',
      securityAnswer: 'Answer',
    }
    const result = await api
      .post('/api/reset')
      .send(resetRequest)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('`newPassword` is required')
  })

  test('reset fails with 400 and message if new password is less than 3 chars', async () => {
    const resetRequest = {
      username: 'root',
      newPassword: 'se',
      securityAnswer: 'Answer',
    }
    const result = await api
      .post('/api/reset')
      .send(resetRequest)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length'
    )
  })

  test('reset fails with 400 and message if sequrity answer does not match', async () => {
    const resetRequest = {
      username: 'root',
      newPassword: 'sekret2',
      securityAnswer: 'Answer2',
    }
    const result = await api
      .post('/api/reset')
      .send(resetRequest)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('invalid username or security answer')
  })
})

afterAll(() => {
  if (dynamoose.connection) {
    dynamoose.connection.close()
  }
})
