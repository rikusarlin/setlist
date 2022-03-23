/* eslint-disable prettier/prettier */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Band = require('../models/band')

// Define console functions so that they exist...
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}

const api = supertest(app)

describe('when there is initially one band at db', () => {
  beforeEach(async () => {
    await Band.deleteMany({})
    const band = {
      username: 'root',
      name: 'root band',
      password: 'sekret',
      securityQuestion: 'Question',
      securityAnswer: 'Answer'
    }
    await api.post('/api/bands').send(band)
  })
  test('reset succeeds when valid new password and security answer are given', async () => {
    const resetRequest = {
      username: 'root',
      newPassword: 'sekret2',
      securityAnswer: 'Answer'
    }
    await api
      .post('/api/reset')
      .send(resetRequest)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('reset fails with 400 and message if username is not present', async () => {
    const resetRequest = {
      newPassword: 'sekret2',
      securityAnswer: 'Answer'
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
      securityAnswer: 'Answer'
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
      securityAnswer: 'Answer'
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
      securityAnswer: 'Answer2'
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
  mongoose.connection.close()
})
