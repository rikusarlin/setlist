const dynamoose = require('dynamoose')
const supertest = require('supertest')
const helper = require('./pieces_test_helper')
const bandHelper = require('./bands_test_helper')
const app = require('../app')
const Piece = require('../models/piece')
const jwt = require('jsonwebtoken')
const testUtil = require('./test_utils')
const Setlist = require('../models/setlist')
const Band = require('../models/band')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

var token
var decodedToken
var piece, piece2

global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}

const setlistsInDb = async () => {
  dynamoose.aws.ddb.local()
  const setlists = await Setlist.scan('band')
    .eq(decodedToken.username)
    .attributes(['id', 'name', 'pieces'])
    .exec()
  return setlists
}

beforeAll(async () => {
  try {
    dynamoose.aws.ddb.local()
    var newBand = bandHelper.newBand
    newBand.username = testUtil.randomStr(16)
    await api.post('/api/bands').send(newBand)
    const res = await api.post('/api/login').send(newBand)
    token = res.body.token
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (execption) {
    console.error(execption)
  }
})

beforeEach(async () => {
  try {
    dynamoose.aws.ddb.local()
    const pieces = await Piece.scan().exec()
    pieces.map(async (piece) => await piece.delete())
    var newPiece1 = new Piece(helper.initialPieces[0])
    newPiece1.band = decodedToken.username
    newPiece1.id = uuidv4()
    var newPiece2 = new Piece(helper.initialPieces[1])
    newPiece2.band = decodedToken.username
    newPiece2.id = uuidv4()
    piece = await newPiece1.save()
    piece2 = await newPiece2.save()
    const setlists2 = await Setlist.scan().exec()
    setlists2.map(async (setlist) => {
      await Setlist.delete({ id: setlist.id, band: setlist.band })
    })
    var setlist = new Setlist({
      id: uuidv4(),
      name: 'Setlist name',
      band: decodedToken.username,
      pieces: [piece.id],
    })
    const savedSetlist = await setlist.save()
    var band = await Band.get(decodedToken.username)
    if (!band.setlists) {
      band.setlists = []
    }
    band.setlists = band.setlists.concat(savedSetlist.id)
    await band.save()
  } catch (execption) {
    console.error(execption)
  }
})

describe('fetch setlists', () => {
  test('setlists are returned as json', async () => {
    await api
      .get('/api/setlist')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all setlists are returned', async () => {
    const response = await api
      .get('/api/setlist')
      .set('Authorization', `bearer ${token}`)
    expect(response.body.length).toBe(1)
  })
  test('a specific setlist is within the list of returned setlists', async () => {
    const response = await api
      .get('/api/setlist')
      .set('Authorization', `bearer ${token}`)
    const names = response.body.map((s) => s.name)
    expect(names).toContain('Setlist name')
  })
})

describe('insert new setlist', () => {
  test('number of setlists increases when a new setlist is added', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    const newSetlist = { name: 'New setlist' }
    await api
      .post('/api/setlist')
      .set('Authorization', `bearer ${token}`)
      .send(newSetlist)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const setlistsAtEnd = await setlistsInDb()
    expect(setlistsAtEnd.length).toBe(setlistsAtBeginning.length + 1)
  })
  test('an inserted setlist can be found after addition', async () => {
    const newSetlist = { name: 'New setlist' }
    await api
      .post('/api/setlist')
      .set('Authorization', `bearer ${token}`)
      .send(newSetlist)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api
      .get('/api/setlist')
      .set('Authorization', `bearer ${token}`)
    const names = response.body.map((s) => s.name)
    expect(names).toContain(newSetlist.name)
  })
  test('name is required', async () => {
    const newSetlist = {}
    await api
      .post('/api/setlist')
      .set('Authorization', `bearer ${token}`)
      .send(newSetlist)
      .expect(400)
  })
  test('creation fails with 400 and message if name is less than 3 chars', async () => {
    const newSetlist = { name: 'Ne' }
    const result = await api
      .post('/api/setlist')
      .set('Authorization', `bearer ${token}`)
      .send(newSetlist)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain(
      'is shorter than the minimum allowed length'
    )
  })
})

describe('insert piece to setlist', () => {
  test('number of pieces in setlist increases when a new piece is added', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const setlistsAtEnd = await setlistsInDb()
    expect(setlistsAtEnd[0].pieces.length).toBe(
      setlistsAtBeginning[0].pieces.length + 1
    )
  })
  test('an inserted piece in setlist can be found after addition', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    const response = await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const pieceTitles = response.body.pieces.map((piece) => piece.title)
    expect(pieceTitles).toContain(piece2.title)
  })
  test('addition fails with 404 and message if setlist is not found', async () => {
    var randomId = uuidv4()
    const response = await api
      .put(`/api/setlist/${randomId}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('setlist not found')
  })
  test('addition fails with 404 and message if piece is not found', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    var randomId = uuidv4()
    const response = await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${randomId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('piece not found')
  })
  test('cannot add a piece to setlist if it already has been added', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    const response = await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
    expect(response.body.error).toContain('piece is already in setlist')
  })
  test('need to be authorized', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}`)
      .expect(401)
  })
})

describe('delete piece from setlist', () => {
  test('number of pieces in setlist decreases when a new piece is deleted', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .delete(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const setlistsAtEnd = await setlistsInDb()
    expect(setlistsAtEnd[0].pieces.length).toBe(
      setlistsAtBeginning[0].pieces.length - 1
    )
  })
  test('an inserted piece in setlist cannot be found after deletion', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const response = await api
      .delete(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const pieceTitles = response.body.pieces.map((piece) => piece.title)
    expect(pieceTitles).not.toContain(piece2.title)
  })
  test('addition fails with 404 and message if setlist is not found', async () => {
    var randomId = uuidv4()
    const response = await api
      .delete(`/api/setlist/${randomId}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('setlist not found')
  })
  test('addition fails with 404 and message if piece is not found', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    var randomId = uuidv4()
    const response = await api
      .delete(`/api/setlist/${setlistsAtBeginning[0].id}/${randomId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('piece not found')
  })
  test('no changes if trying to delete a piece from setlist is piece is not in setlist', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .delete(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistsAtEnd = await setlistsInDb()
    expect(setlistsAtEnd[0].pieces.length).toBe(
      setlistsAtBeginning[0].pieces.length
    )
  })
  test('need to be authorized', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .delete(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}`)
      .expect(401)
  })
})

describe('delete setlist', () => {
  test('deletion succeeds with a valid id', async () => {
    const setlistsAtStart = await setlistsInDb()
    const setlistToDelete = setlistsAtStart[0]
    await api
      .delete(`/api/setlist/${setlistToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    const setlistsAfterDelete = await setlistsInDb()
    expect(setlistsAfterDelete.length).toBe(setlistsAtStart.length - 1)
  })
  test('succeeds with 204 status when called with non-existing but valid id', async () => {
    await api
      .delete('/api/setlist/5dfa698896cfe676450a2916')
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  })
  test('fails with 404 status trying to delete other bands setlist', async () => {
    var newBand2 = bandHelper.newBand
    newBand2.username = testUtil.randomStr(16)
    await api.post('/api/bands').send(newBand2)
    const res = await api.post('/api/login').send({
      username: newBand2.username,
      password: bandHelper.newBand.password,
    })
    const token2 = res.body.token
    const setlistsAtStart = await setlistsInDb()
    const setlistToDelete = setlistsAtStart[0]
    await api
      .delete(`/api/setlist/${setlistToDelete.id}`)
      .set('Authorization', `bearer ${token2}`)
      .expect(404)
    const setlistsAfterDelete = await setlistsInDb()
    expect(setlistsAfterDelete.length).toBe(setlistsAtStart.length)
  })
})

describe('move pieces in setlist', () => {
  test('2nd piece in list becomes 1st when moved up', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistsBeforeUpdate = await setlistsInDb()
    const indexBeforeUpdate = setlistsBeforeUpdate[0].pieces.indexOf(piece2.id)
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}/up`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistsAfterUpdate = await setlistsInDb()
    const indexAfterUpdate = setlistsAfterUpdate[0].pieces.indexOf(piece2.id)
    expect(indexBeforeUpdate).toBe(indexAfterUpdate + 1)
  })
  test('1st piece in list stays 1st when moved up', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistsBeforeUpdate = await setlistsInDb()
    const indexBeforeUpdate = setlistsBeforeUpdate[0].pieces.indexOf(piece.id)
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}/up`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistsAfterUpdate = await setlistsInDb()
    const indexAfterUpdate = setlistsAfterUpdate[0].pieces.indexOf(piece.id)
    expect(indexBeforeUpdate).toBe(indexAfterUpdate)
  })
  test('1st piece in list becomes 2nd when moved down', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistsBeforeUpdate = await setlistsInDb()
    const indexBeforeUpdate = setlistsBeforeUpdate[0].pieces.indexOf(piece.id)
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}/down`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistsAfterUpdate = await setlistsInDb()
    const indexAfterUpdate = setlistsAfterUpdate[0].pieces.indexOf(piece.id)
    expect(indexBeforeUpdate).toBe(indexAfterUpdate - 1)
  })
  test('last piece in list stays last when moved down', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistsBeforeUpdate = await setlistsInDb()
    const indexBeforeUpdate = setlistsBeforeUpdate[0].pieces.indexOf(piece2.id)
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}/down`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistsAfterUpdate = await setlistsInDb()
    const indexAfterUpdate = setlistsAfterUpdate[0].pieces.indexOf(piece2.id)
    expect(indexBeforeUpdate).toBe(indexAfterUpdate)
  })
  test('moving fails with 404 and message if setlist is not found', async () => {
    var randomId = uuidv4()
    const response = await api
      .put(`/api/setlist/${randomId}/${piece2.id}/up`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('setlist not found')
  })
  test('addition fails with 404 and message if piece is not found', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    var randomId = uuidv4()
    const response = await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${randomId}/down`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('piece not found')
  })
  test('fail with 404 if moving a piece that is not in setlist', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    const response = await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece2.id}/down`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('piece not in setlist')
  })
  test('fails with 400 if moving direction is not up or down', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    const response = await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}/sideways`)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
    expect(response.body.error).toContain(
      'invalid direction, only up and down are allowed'
    )
  })
  test('need to be authorized', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    await api
      .put(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}`)
      .expect(401)
  })
})

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500))
  if (dynamoose.connection) {
    dynamoose.connection.close()
  }
})
