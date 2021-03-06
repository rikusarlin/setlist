const mongoose = require('mongoose')

const pieceSchema = mongoose.Schema({
  title: String,
  artist: String,
  duration: Number,
  delay: Number,
  band: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
  },
  notes: [
    {
      instrument: String,
      rows: [
        {
          rowNumber: Number,
          contents: String,
        },
      ],
    },
  ],
  pages: [
    {
      pageNumber: Number,
      duration: Number,
      delay: Number,
      rows: [
        {
          rowNumber: Number,
          rowType: {
            type: String,
            enum: ['Label', 'Chords', 'Lyrics'],
          },
          contents: String,
        },
      ],
    },
  ],
})

pieceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    if (typeof returnedObject.notes !== 'undefined') {
      returnedObject.notes.map((note) => {
        if (typeof note.rows !== 'undefined') {
          note.rows.map((row) => delete row._id)
        }
      })
      returnedObject.notes.map((note) => delete note._id)
    }
    if (typeof returnedObject.pages !== 'undefined') {
      returnedObject.pages.map((page) => {
        if (typeof page.rows !== 'undefined') {
          page.rows.map((row) => delete row._id)
        }
      })
      returnedObject.pages.map((page) => delete page._id)
    }
  },
})

module.exports = mongoose.model('Piece', pieceSchema)
