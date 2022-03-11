const piecesRouter = require('express').Router()
const Piece = require('../models/piece')
const Setlist = require('../models/setlist')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const { transpose } = require('../utils/music')

piecesRouter.get('/', async (request, response, next) => {
  try {
    let pieces = await Piece.find({}, ['title', 'artist', 'bpm'])
    logger.info(`In piecesRouter.getAll, found:${pieces.length} pieces`)
    response.json(pieces)
  } catch (error) {
    next(error)
  }
})

piecesRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    if (typeof req.body.title === 'undefined') {
      return res.status(400).json({ error: 'Title of piece is required' })
    }
    if (typeof req.body.artist === 'undefined') {
      return res.status(400).json({ error: 'Artist of piece is required' })
    }

    let piece = {
      title: req.body.title,
      artist: req.body.artist,
      bpm: req.body.bpm,
      pages: req.body.pages,
    }
    if (typeof req.body.bpm === 'undefined') {
      piece.bpm = 0
    }

    let newPiece = new Piece(piece)
    let savedPiece = await newPiece.save()
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
    const tokenUser = await User.findById(decodedToken.id)
    logger.info('tokenUser: ', tokenUser)
    logger.info('id: ', req.params.id)
    let pieceToDelete = await Piece.findById(req.params.id)
    logger.info('pieceToDelete: ', pieceToDelete)

    if (!pieceToDelete) {
      return res.status(204).end()
    }

    // Delete piece from setlists, if any
    const setlistsWithPiece = await Setlist.find({
      pieces: { _id: req.params.id },
    })
    for (let setlist = 0; setlist < setlistsWithPiece.length; setlist++) {
      var pieceIndex = setlist.pieces.indexOf(req.params.id)
      setlist.pieces.splice(pieceIndex, 1)
      setlist.save()
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
      bpm: req.body.bpm,
      pages: req.body.pages,
    }
    if (typeof req.body.bpm === 'undefined') {
      piece.bpm = 0
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

module.exports = {
  piecesRouter,
}
