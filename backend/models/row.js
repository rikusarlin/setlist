const mongoose = require('mongoose')

const rowSchema = mongoose.Schema({
  rowNumber: Number,
  pageNumber: Number,
  rowType: {
    type: String,
    enum : ['Label','Chords','Lyrics']
  },
  contents: String,
  page:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page'
  },
  piece:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Piece'
  }
})

rowSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Row', rowSchema)
