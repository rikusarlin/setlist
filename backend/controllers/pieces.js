const piecesRouter = require('express').Router()
const Piece = require('../models/piece')
const Setlist = require('../models/setlist')
const Band = require('../models/band')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const { transpose } = require('../utils/music')

piecesRouter.get('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    let pieces = await Piece.find({ band: decodedToken.id }, [
      'title',
      'artist',
      'duration',
      'delay',
    ])
    response.json(pieces)
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const band = await Band.findById(decodedToken.id)

    if (typeof req.body.title === 'undefined') {
      return res.status(400).json({ error: 'Title of piece is required' })
    }
    if (typeof req.body.artist === 'undefined') {
      return res.status(400).json({ error: 'Artist of piece is required' })
    }

    let piece = {
      title: req.body.title,
      artist: req.body.artist,
      duration: req.body.duration,
      delay: req.body.delay,
      pages: req.body.pages,
      notes: req.body.notes,
      band: band._id,
    }
    if (typeof req.body.delay === 'undefined') {
      piece.delay = 0
    }
    if (typeof req.body.duration === 'undefined') {
      piece.duration = 0
    }

    let newPiece = new Piece(piece)
    let savedPiece = await newPiece.save()
    band.pieces = band.pieces.concat(savedPiece._id)
    await band.save()
    res.status(201).json(savedPiece.toJSON())
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.get('/:id', async (req, res, next) => {
  try {
    const piece = await Piece.findById(req.params.id)

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
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    let pieceToDelete = await Piece.findById(req.params.id)

    if (!pieceToDelete) {
      return res.status(204).end()
    }

    // Can delete piece from own band only
    if (
      new String(pieceToDelete.band).valueOf() !=
      new String(decodedToken.id).valueOf()
    ) {
      return res.status(404).end()
    }

    // Delete piece from setlists, if any
    const setlistsWithPiece = await Setlist.find({
      pieces: { _id: req.params.id },
    })
    for (let setlist = 0; setlist < setlistsWithPiece.length; setlist++) {
      var pieceIndex = setlistsWithPiece[setlist].pieces.indexOf(req.params.id)
      setlistsWithPiece[setlist].pieces.splice(pieceIndex, 1)
      setlistsWithPiece[setlist].save()
    }
    // Delete piece from band, if any
    const bandsWithPiece = await Band.find({
      pieces: { _id: req.params.id },
    })
    for (let band = 0; band < bandsWithPiece.length; band++) {
      var pieceIndex2 = bandsWithPiece[band].pieces.indexOf(req.params.id)
      bandsWithPiece[band].pieces.splice(pieceIndex2, 1)
      bandsWithPiece[band].save()
    }
    await Piece.findByIdAndRemove(pieceToDelete._id).setOptions({
      useFindAndModify: false,
    })
    return res.status(204).end()
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

piecesRouter.put('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }
    const band = await Band.findById(decodedToken.id)

    if (typeof req.body.title === 'undefined') {
      return res.status(400).json({ error: 'Title of piece is required' })
    }
    if (typeof req.body.artist === 'undefined') {
      return res.status(400).json({ error: 'Artist of piece is required' })
    }
    let piece = {
      id: req.params.id,
      title: req.body.title,
      artist: req.body.artist,
      duration: req.body.duration,
      delay: req.body.delay,
      pages: req.body.pages,
      notes: req.body.notes,
      band: band._id,
    }
    if (typeof req.body.duration === 'undefined') {
      piece.duration = 0
    }
    if (typeof req.body.delay === 'undefined') {
      piece.delay = 0
    }

    let previousPiece = await Piece.findById(req.params.id)
    if (!previousPiece) {
      res.status(404).end()
    }

    previousPiece.overwrite(piece)
    let updatedPiece = await previousPiece.save()
    if (updatedPiece) {
      res.json(updatedPiece.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

piecesRouter.put('/:id/transpose/:dir', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }

    let piece = await Piece.findById(req.params.id)
    if (!piece) {
      res.status(404).end()
    }

    if (req.params.dir === 'undefined') {
      return res.status(400).json({ error: 'Transposing direction not given' })
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

    piece.overwrite(piece)
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
