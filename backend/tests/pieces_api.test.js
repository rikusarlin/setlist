const dynamoose = require('dynamoose')
const supertest = require('supertest')
const helper = require('./pieces_test_helper')
const bandHelper = require('./bands_test_helper')
const app = require('../app')
const BandSetlist = require('../models/bandsetlist')
//const jwt = require('jsonwebtoken')
const testUtil = require('./test_utils')

const api = supertest(app)

var token
//var decodedToken

// Define console functions so that they exist...
// Comment if you wish to see console.log
/*
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}
*/

beforeAll(async () => {
  try {
    dynamoose.aws.ddb.local()
    const bands = await BandSetlist.query('sk').eq('BAND').using('GSI1').exec()
    await Promise.all(
      bands.map(async (band) => {
        await band.delete()
      })
    )
    var newBand = bandHelper.newBand
    newBand.username = testUtil.randomStr(16)
    await api.post('/api/bands').send(newBand)
    const res = await api.post('/api/login').send(newBand)
    token = res.body.token
    //decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (execption) {
    console.error(execption)
  }
})

beforeEach(async () => {
  try {
    dynamoose.aws.ddb.local()
    const pieces = await BandSetlist.query('sk')
      .eq('PIECE')
      .using('GSI1')
      .exec()
    await Promise.all(
      pieces.map(async (piece) => {
        await piece.delete()
      })
    )
    await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.initialPieces[0])
    await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.initialPieces[1])
  } catch (execption) {
    console.error(execption)
  }
})

describe('fetch all pieces', () => {
  test('pieces are returned as json', async () => {
    await api
      .get('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all pieces are returned', async () => {
    const response = await api
      .get('/api/pieces')
      .set('Authorization', `bearer ${token}`)
    expect(response.body.length).toBe(helper.initialPieces.length)
  })
  test('a specific piece is within the returned pieces', async () => {
    const response = await api
      .get('/api/pieces')
      .set('Authorization', `bearer ${token}`)
    const titles = response.body.map((r) => r.title)
    expect(titles).toContain('Knockin on Heavens Door')
  })
})

describe('insert new pieces', () => {
  test('number of pieces increases when a new piece is added', async () => {
    await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newPiece)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const piecesAtEnd = await helper.piecesInDb()
    expect(piecesAtEnd.length).toBe(helper.initialPieces.length + 1)
  })
  test('an inserted piece can be found after addition', async () => {
    await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newPiece)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api
      .get('/api/pieces')
      .set('Authorization', `bearer ${token}`)
    const titles = response.body.map((r) => r.title)
    expect(titles).toContain(helper.newPiece.title)
  })
  test('an inserted piece with no duration result in piece with 0 duration', async () => {
    delete helper.newPiece.duration
    const response = await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newPiece)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.duration).toBe(0)
  })
  test('an inserted piece with no delay result in piece with 0 delay', async () => {
    delete helper.newPiece.delay
    const response = await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newPiece)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.delay).toBe(0)
  })
  test('title is required', async () => {
    delete helper.newPiece.title
    await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newPiece)
      .expect(400)
  })
  test('artist is required', async () => {
    delete helper.newPiece.artist
    await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newPiece)
      .expect(400)
  })
})

describe('view a specific piece', () => {
  test('viewing succeeds with a valid id', async () => {
    const piecesAtStart = await helper.piecesInDb()
    const pieceToView = piecesAtStart[0]
    const resultPiece = await api
      .get(`/api/pieces/${pieceToView.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultPiece.body.toString()).toEqual(pieceToView.toString())
  })
  test('does not succeed with 404 status when called with non-existing but valid id', async () => {
    await api
      .get('/api/pieces/5dfa698896cfe676450a2916')
      .set('Authorization', `bearer ${token}`)
      .expect(404)
  })
})

describe('delete piece', () => {
  test('deletion succeeds with a valid id', async () => {
    const piecesAtStart = await helper.piecesInDb()
    const pieceToDelete = piecesAtStart[0]
    await api
      .delete(`/api/pieces/${pieceToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    const piecesAfterDelete = await helper.piecesInDb()
    expect(piecesAfterDelete.length).toBe(piecesAtStart.length - 1)
  })
  test('succeeds with 204 status when called with non-existing but valid id', async () => {
    await api
      .delete('/api/pieces/5dfa698896cfe676450a2916')
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  })
  test('fails with 404 status trying to delete other bands piece', async () => {
    var newBand2 = bandHelper.newBand
    newBand2.username = testUtil.randomStr(16)
    await api.post('/api/bands').send(newBand2)
    const res = await api.post('/api/login').send({
      username: newBand2.username,
      password: bandHelper.newBand.password,
    })
    const token2 = res.body.token
    const piecesAtStart = await helper.piecesInDb()
    const pieceToDelete = piecesAtStart[0]
    await api
      .delete(`/api/pieces/${pieceToDelete.id}`)
      .set('Authorization', `bearer ${token2}`)
      .expect(404)
    const piecesAfterDelete = await helper.piecesInDb()
    expect(piecesAfterDelete.length).toBe(piecesAtStart.length)
  })
})

/*
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
*/

describe('update piece', () => {
  /*
  test('update duration of piece', async () => {
    var piecesAtStart = await sleep(1000).then(() => helper.piecesInDb())
    var pieceToUpdate = piecesAtStart[0]
    const durationBeforeUpdate = pieceToUpdate.duration
    pieceToUpdate.duration += 10
    await api
      .put(`/api/pieces/${pieceToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(pieceToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const resultPiece = await api
      .get(`/api/pieces/${pieceToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultPiece.body.duration).toBe(durationBeforeUpdate + 10)
  })
  test('update delay of piece', async () => {
    const piecesAtStart = await helper.piecesInDb()
    const pieceToUpdate = piecesAtStart[0]
    const delayBeforeUpdate = pieceToUpdate.delay
    pieceToUpdate.delay += 10
    await api
      .put(`/api/pieces/${pieceToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(pieceToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const resultPiece = await api
      .get(`/api/pieces/${pieceToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultPiece.body.delay).toBe(delayBeforeUpdate + 10)
  })
  */
  test('update without title results in 400', async () => {
    const piecesAtStart = await helper.piecesInDb()
    var pieceToUpdate = piecesAtStart[0]
    delete pieceToUpdate.title
    await api
      .put(`/api/pieces/${pieceToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(pieceToUpdate)
      .expect(400)
  })
  test('update without artist results in 400', async () => {
    const piecesAtStart = await helper.piecesInDb()
    var pieceToUpdate = piecesAtStart[0]
    delete pieceToUpdate.artist
    await api
      .put(`/api/pieces/${pieceToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(pieceToUpdate)
      .expect(400)
  })
})

describe('transpose piece', () => {
  test('transpose up', async () => {
    const piecesAtStart = await helper.piecesInDb()
    const pieceToTranspose = piecesAtStart[0]
    const resultPiece = await api
      .put(`/api/pieces/${pieceToTranspose.id}/transpose/up`)
      .set('Authorization', `bearer ${token}`)
      .send(pieceToTranspose)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultPiece.body.pages[0].rows[1].contents).toBe('G# D# Bbm')
  })
  test('transpose down', async () => {
    const piecesAtStart = await helper.piecesInDb()
    const pieceToTranspose = piecesAtStart[0]
    const resultPiece = await api
      .put(`/api/pieces/${pieceToTranspose.id}/transpose/down`)
      .set('Authorization', `bearer ${token}`)
      .send(pieceToTranspose)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultPiece.body.pages[0].rows[1].contents).toBe('F# C# G#m')
  })
})

afterAll(() => {
  if (dynamoose.connection) {
    dynamoose.connection.close()
  }
})
