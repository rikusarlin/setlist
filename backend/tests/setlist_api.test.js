const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./pieces_test_helper')
const bandHelper = require('./bands_test_helper')
const app = require('../app')
const Piece = require('../models/piece')
const jwt = require('jsonwebtoken')
const testUtil = require('./test_utils')
const Setlist = require('../models/setlist')
const Band = require('../models/band')

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
  let setlists = await Setlist.find(
    { band: decodedToken.id },
    { name: 1 }
  ).populate('pieces', { title: 1, artist: 1, id: 1 })
  return setlists.map((setlist) => setlist.toJSON())
}

beforeAll(async () => {
  var newBand = bandHelper.newBand
  newBand.username = testUtil.randomStr(16)
  await api.post('/api/bands').send(newBand)
  const res = await api.post('/api/login').send({
    username: newBand.username,
    password: bandHelper.newBand.password,
  })
  token = res.body.token
  decodedToken = jwt.verify(token, process.env.SECRET)
})

beforeEach(async () => {
  await Piece.deleteMany({})
  const pieceObjects = helper.initialPieces.map((piece) => new Piece(piece))
  const piecePromiseArray = pieceObjects.map((piece) => {
    piece.band = decodedToken.id
    return piece.save()
  })
  await Promise.all(piecePromiseArray)
  const pieces = await Piece.find({ band: decodedToken.id })
  piece = pieces[0]
  piece2 = pieces[1]
  await Setlist.deleteMany({})
  const setlist = new Setlist({
    name: 'Setlist name',
    band: decodedToken.id,
    pieces: [piece.id],
  })
  const savedSetlist = await setlist.save()
  const band = await Band.findById(decodedToken.id)
  band.setlists = band.setlists.concat(savedSetlist._id)
  await band.save()
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
    var randomId = mongoose.Types.ObjectId()
    const response = await api
      .put(`/api/setlist/${randomId}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('setlist not found')
  })
  test('addition fails with 404 and message if piece is not found', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    var randomId = mongoose.Types.ObjectId()
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
    const response = await api
      .delete(`/api/setlist/${setlistsAtBeginning[0].id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const pieceTitles = response.body.pieces.map((piece) => piece.title)
    expect(pieceTitles).not.toContain(piece.title)
  })
  test('addition fails with 404 and message if setlist is not found', async () => {
    var randomId = mongoose.Types.ObjectId()
    const response = await api
      .delete(`/api/setlist/${randomId}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('setlist not found')
  })
  test('addition fails with 404 and message if piece is not found', async () => {
    const setlistsAtBeginning = await setlistsInDb()
    var randomId = mongoose.Types.ObjectId()
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

afterAll(() => {
  mongoose.connection.close()
})
