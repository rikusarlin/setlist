const piecesRouter = require('express').Router()
const BandSetlist = require('../models/bandsetlist')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const { transpose } = require('../utils/music')
const { v4: uuidv4 } = require('uuid')

piecesRouter.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.username) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const pieces = await BandSetlist.query('sk')
      .eq('PIECE')
      .where('data')
      .eq(`BAND-${decodedToken.username}`)
      .attributes(['id', 'title', 'artist'])
      .using('GSI1')
      .exec()
    const piecesMapped = pieces.map((piece) => ({
      id: piece.id,
      title: piece.title,
      artist: piece.artist,
      duration: piece.duration,
      delay: piece.delay,
    }))
    response.json(piecesMapped)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.username) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    var band = await BandSetlist.get({
      pk: `BAND-${decodedToken.username}`,
      sk: 'BAND',
    })

    if (typeof req.body.title === 'undefined') {
      return res.status(400).json({ error: 'Title of piece is required' })
    }
    if (typeof req.body.artist === 'undefined') {
      return res.status(400).json({ error: 'Artist of piece is required' })
    }

    const pieceId = uuidv4()
    let piece = {
      pk: `PIECE-${pieceId}`,
      sk: 'PIECE',
      data: `BAND-${decodedToken.username}`,
      id: pieceId,
      title: req.body.title,
      artist: req.body.artist,
      duration: parseInt(req.body.duration, 10),
      delay: parseInt(req.body.delay, 10),
      pages: req.body.pages,
      notes: req.body.notes,
    }
    if (typeof req.body.delay === 'undefined') {
      piece.delay = 0
    }
    if (typeof req.body.duration === 'undefined') {
      piece.duration = 0
    }

    let newPiece = new BandSetlist(piece)
    let savedPiece = await newPiece.save()
    await band.save()
    res.status(201).json(savedPiece.toJSON())
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.get('/:id', async (req, res, next) => {
  try {
    const piece = await BandSetlist.get({
      pk: `PIECE-${req.params.id}`,
      sk: 'PIECE',
    })

    if (piece) {
      res.json(piece.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.delete('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.username) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const pieceToDelete = await BandSetlist.get({
      pk: `PIECE-${req.params.id}`,
      sk: 'PIECE',
    })

    if (!pieceToDelete) {
      return res.status(204).end()
    }

    // Can delete piece from own band only
    if (
      new String(pieceToDelete.data).valueOf() !=
      new String(`BAND-${decodedToken.username}`).valueOf()
    ) {
      return res.status(404).end()
    }

    await pieceToDelete.delete()
    return res.status(204).end()
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.put('/:id', async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.username) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }
    if (typeof req.body.title === 'undefined') {
      return res.status(400).json({ error: 'Title of piece is required' })
    }
    if (typeof req.body.artist === 'undefined') {
      return res.status(400).json({ error: 'Artist of piece is required' })
    }
    const prevPiece = await BandSetlist.get({
      pk: `PIECE-${req.params.id}`,
      sk: 'PIECE',
    })
    var previousPiece = prevPiece
    if (!previousPiece) {
      res.status(404).end()
    }
    // Can transpose piece from own band only
    if (
      new String(previousPiece.data).valueOf() !=
      new String(`BAND-${decodedToken.username}`).valueOf()
    ) {
      return res.status(404).end()
    }

    previousPiece.title = req.body.title
    previousPiece.artist = req.body.artist
    previousPiece.duration = parseInt(req.body.duration, 10)
    previousPiece.delay = parseInt(req.body.delay, 10)
    previousPiece.pages = req.body.pages
    previousPiece.notes = req.body.notes

    if (typeof req.body.duration === 'undefined') {
      previousPiece.duration = 0
    }
    if (typeof req.body.delay === 'undefined') {
      previousPiece.delay = 0
    }

    const savedPiece = await previousPiece.save()
    if (savedPiece) {
      res.json(savedPiece.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    const errorText = error.toString()
    console.log(errorText)
    next(error)
  }
})

piecesRouter.put('/:id/transpose/:dir', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.username) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }

    var piece = await BandSetlist.get({
      pk: `PIECE-${req.params.id}`,
      sk: 'PIECE',
    })
    if (!piece) {
      res.status(404).end()
    }

    if (req.params.dir === 'undefined') {
      return res.status(400).json({ error: 'Transposing direction not given' })
    }

    // Can transpose piece from own band only
    if (
      new String(piece.data).valueOf() !=
      new String(`BAND-${decodedToken.username}`).valueOf()
    ) {
      return res.status(404).end()
    }

    for (let page = 0; page < piece.pages.length; page++) {
      for (let row = 0; row < piece.pages[page].rows.length; row++) {
        if (piece.pages[page].rows[row].rowType === 'Chords') {
          piece.pages[page].rows[row].contents = transpose(
            piece.pages[page].rows[row].contents,
            req.params.dir === 'up'
          )
        }
      }
    }

    let updatedPiece = await piece.save()
    if (updatedPiece) {
      res.json(updatedPiece.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = piecesRouter
