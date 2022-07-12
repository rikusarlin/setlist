const analyzeRouter = require('express').Router()
const logger = require('../utils/logger')
const { chordTest } = require('../utils/music')
const Piece = require('../models/piece')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const onlyWhitespace = (str) => {
  return /^\s*$/.test(str)
}

analyzeRouter.post('/', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.username) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    if (typeof req.body.contents === 'undefined') {
      return res.status(400).json({ error: 'No contents to analyze' })
    }
    if (typeof req.body.title === 'undefined') {
      return res.status(400).json({ error: 'Title of piece is required' })
    }
    if (typeof req.body.artist === 'undefined') {
      return res.status(400).json({ error: 'Artist of piece is required' })
    }
    if (
      typeof req.body.noteContents !== 'undefined' &&
      typeof req.body.noteInstrument === 'undefined'
    ) {
      return res
        .status(400)
        .json({ error: 'Note instrument is required if notes are given' })
    }

    let piece = {
      id: uuidv4(),
      title: req.body.title,
      artist: req.body.artist,
      duration: req.body.duration,
      delay: req.body.delay,
      notes: req.body.notes,
      pages: req.body.pages,
      band: decodedToken.username,
    }
    if (typeof req.body.delay === 'undefined') {
      piece.delay = 0
    }
    if (typeof req.body.duration === 'undefined') {
      piece.duration = 0
    }

    let skipWhitespace
    if (typeof req.body.skipWhitespace === 'undefined') {
      skipWhitespace = false
    } else {
      skipWhitespace = req.body.skipWhitespace
    }

    let contents = req.body.contents
    if (contents.indexOf('\n') === -1) {
      contents = contents + '\n'
    }
    let rows = []
    req.body.contents.split('\n').map((row, index) => {
      if (!(skipWhitespace && onlyWhitespace(row))) {
        // Analyze whether the row is lyrics, chords or label
        let rowType = 'Lyrics'
        if (row.indexOf('[') >= 0) {
          rowType = 'Label'
        } else if (chordTest.test(`  ${row}  `)) {
          rowType = 'Chords'
        }
        rows.push({
          rowNumber: index + 1,
          rowType: rowType,
          contents: row,
        })
      }
    })

    // Change possible german notation to english (H=>B, B => Bb)
    const isGerman = rows
      .filter((row) => row.rowType === 'Chords')
      .map((row) => row.contents.indexOf('H') >= 0)
      .reduce(
        (pieceIsGerman, rowIsGerman) => pieceIsGerman || rowIsGerman,
        false
      )

    if (isGerman) {
      rows = rows.map((row) => {
        return {
          rowNumber: row.rowNumber,
          rowType: row.rowType,
          contents:
            row.rowType === 'Chords'
              ? row.contents.replace('B', 'Bb').replace('H', 'B')
              : row.contents,
        }
      })
    }
    piece.pages[0].rows = rows

    if (typeof req.body.noteContents !== 'undefined') {
      let noteContents = req.body.noteContents
      if (noteContents.indexOf('\n') === -1) {
        noteContents = noteContents + '\n'
      }
      let newNote = {
        instrument: req.body.noteInstrument,
        rows: [],
      }
      req.body.noteContents.split('\n').map((noteRow, index) => {
        newNote.rows.push({
          rowNumber: index + 1,
          contents: noteRow,
        })
      })
      if (typeof piece.notes === 'undefined') {
        piece.notes = []
      }
      const instrumentIndex = piece.notes.findIndex(
        (note) => note.instrument === req.body.noteInstrument
      )
      if (instrumentIndex >= 0) {
        piece.notes[instrumentIndex] = newNote
      } else {
        piece.notes.push(newNote)
      }
      console.log('piece.notes: ' + JSON.stringify(piece.notes))
    }

    // logger.info('rows: '+JSON.stringify(piece))
    let newPiece = new Piece(piece)
    let savedPiece = await newPiece.save()
    res.status(201).json(savedPiece.toJSON())
  } catch (error) {
    logger.error('error: ' + error)
    next(error)
  }
})

module.exports = analyzeRouter
