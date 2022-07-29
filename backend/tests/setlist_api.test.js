const dynamoose = require('dynamoose')
const supertest = require('supertest')
const helper = require('./pieces_test_helper')
const bandHelper = require('./bands_test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')
const testUtil = require('./test_utils')
const BandSetlist = require('../models/bandsetlist')
const { v4: uuidv4 } = require('uuid')

const api = supertest(app)

var token
var decodedToken
var piece, piece2
var setlist

global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}

const setlistsInDb = async () => {
  dynamoose.aws.ddb.local()
  const setlists = await BandSetlist.query('sk')
    .eq('SETLIST')
    .using('GSI1')
    .exec()
  return setlists
}

const setlistPiecesInDb = async (id) => {
  dynamoose.aws.ddb.local()
  const setlistPieces = await BandSetlist.query('pk')
    .eq(`SETLIST-${id}`)
    .where('sk')
    .beginsWith(`PIECE-`)
    .attributes([
      'id',
      'pk',
      'sk',
      'data',
      'setlistName',
      'title',
      'artist',
      'indexInSetlist',
    ])
    .exec()
  return setlistPieces
}

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
    decodedToken = jwt.verify(token, process.env.SECRET)
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
    const piece1Response = await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.initialPieces[0])
    piece = piece1Response.body
    const piece2Response = await api
      .post('/api/pieces')
      .set('Authorization', `bearer ${token}`)
      .send(helper.initialPieces[1])
    piece2 = piece2Response.body

    const setlists2 = await BandSetlist.query('sk')
      .eq('SETLIST')
      .using('GSI1')
      .exec()
    await Promise.all(
      setlists2.map(async (setlist) => {
        await setlist.delete()
      })
    )

    const id = uuidv4()
    setlist = new BandSetlist({
      pk: `SETLIST-${id}`,
      sk: 'SETLIST',
      id: id,
      setlistName: 'Setlist name',
      data: `BAND-${decodedToken.username}`,
    })
    setlist = await setlist.save()
  } catch (execption) {
    console.error(execption)
  }
})

describe('fetch setlist', () => {
  test('setlist is returned as json', async () => {
    await api
      .get(`/api/setlist/${setlist.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all pieces are returned', async () => {
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const response = await api
      .get(`/api/setlist/${setlist.id}`)
      .set('Authorization', `bearer ${token}`)
    expect(response.body.pieces.length).toBe(1)
  })
  test('404 is returned if called with non-existing id', async () => {
    await api
      .get('/api/setlist/4398704397')
      .set('Authorization', `bearer ${token}`)
      .expect(404)
  })
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
    const setlistPiecesAtBeginning = await setlistPiecesInDb(setlist.id)
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const setlistPiecesAtEnd = await setlistPiecesInDb(setlist.id)
    expect(setlistPiecesAtEnd.length).toBe(setlistPiecesAtBeginning.length + 1)
  })
  test('an inserted piece in setlist can be found after addition', async () => {
    const response = await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
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
    var randomId = uuidv4()
    const response = await api
      .put(`/api/setlist/${setlist.id}/${randomId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    expect(response.body.error).toContain('piece not found')
  })
  test('cannot add a piece to setlist if it already has been added', async () => {
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const response = await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
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
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistPiecesAtBeginning = await setlistPiecesInDb(setlist.id)
    await api
      .delete(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const setlistPiecesAtEnd = await setlistPiecesInDb(setlist.id)
    expect(setlistPiecesAtEnd.length).toBe(setlistPiecesAtBeginning.length - 1)
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
  test('fails with 404 if trying to delete a piece from setlist is piece is not in setlist', async () => {
    const setlistPiecesAtBeginning = await setlistPiecesInDb(setlist.id)
    const response = await api
      .delete(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404)
    const setlistPiecesAtEnd = await setlistPiecesInDb(piece.id)
    expect(setlistPiecesAtEnd.length).toBe(setlistPiecesAtBeginning.length)
    expect(response.body.error).toContain('piece not in setlist')
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
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistPiecesBeforeUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceBeforeUpdate] = setlistPiecesBeforeUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece2.id}`
    )
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}/up`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistPiecesAfterUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceAfterUpdate] = setlistPiecesAfterUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece2.id}`
    )
    expect(setlistPieceBeforeUpdate.indexInSetlist).toBe(
      setlistPieceAfterUpdate.indexInSetlist + 1
    )
  })
  test('1st piece in list stays 1st when moved up', async () => {
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistPiecesBeforeUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceBeforeUpdate] = setlistPiecesBeforeUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece.id}`
    )
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}/up`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistPiecesAfterUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceAfterUpdate] = setlistPiecesAfterUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece.id}`
    )
    expect(setlistPieceBeforeUpdate.indexInSetlist).toBe(
      setlistPieceAfterUpdate.indexInSetlist
    )
  })
  test('1st piece in list becomes 2nd when moved down', async () => {
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistPiecesBeforeUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceBeforeUpdate] = setlistPiecesBeforeUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece.id}`
    )
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}/down`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistPiecesAfterUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceAfterUpdate] = setlistPiecesAfterUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece.id}`
    )
    expect(setlistPieceBeforeUpdate.indexInSetlist).toBe(
      setlistPieceAfterUpdate.indexInSetlist - 1
    )
  })
  test('last piece in list stays last when moved down', async () => {
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}`)
      .set('Authorization', `bearer ${token}`)
    const setlistPiecesBeforeUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceBeforeUpdate] = setlistPiecesBeforeUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece2.id}`
    )
    await api
      .put(`/api/setlist/${setlist.id}/${piece2.id}/down`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
    const setlistPiecesAfterUpdate = await setlistPiecesInDb(setlist.id)
    const [setlistPieceAfterUpdate] = setlistPiecesAfterUpdate.filter(
      (setlistPiece) => setlistPiece.sk === `PIECE-${piece2.id}`
    )
    expect(setlistPieceBeforeUpdate.indexInSetlist).toBe(
      setlistPieceAfterUpdate.indexInSetlist
    )
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
    await api
      .put(`/api/setlist/${setlist.id}/${piece.id}`)
      .set('Authorization', `bearer ${token}`)
    const response = await api
      .put(`/api/setlist/${setlist.id}/${piece.id}/sideways`)
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
