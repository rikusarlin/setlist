const mongoose = require('mongoose')

const pageSchema = mongoose.Schema({
  pageNumber: Number,
  playDuration: Number,
  rows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Row'
    }
  ],
  piece:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Piece'
    }
})

pageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Page', pageSchema)
