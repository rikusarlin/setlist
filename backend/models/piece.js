const dynamoose = require('dynamoose')
const Band = require('./band')

const pieceSchema = new dynamoose.Schema({
  title: String,
  artist: String,
  duration: Number,
  delay: Number,
  band: Band,
  notes: {
    type: Array,
    schema: [
      {
        instrument: String,
        rows: {
          type: Array,
          schema: [
            {
              rowNumber: Number,
              contents: String,
            },
          ],
        },
      },
    ],
  },
  pages: {
    type: Array,
    schema: [
      {
        pageNumber: Number,
        duration: Number,
        delay: Number,
        rows: {
          type: Array,
          schema: [
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
      },
    ],
  },
})

/*
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
*/

module.exports = dynamoose.model('Piece', pieceSchema)
