const mongoose = require('mongoose')

const pieceSchema = mongoose.Schema({
  title: String,
  artist: String,
  bpm: Number,
  pages: [
    {
      pageNumber: Number,
      playDuration: Number,
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
    if (returnedObject.pages !== undefined) {
      returnedObject.pages.map((page) => {
        if (page.rows !== undefined) {
          page.rows.map((row) => delete row._id)
        }
      })
      returnedObject.pages.map((page) => delete page._id)
    }
  },
})

module.exports = mongoose.model('Piece', pieceSchema)
