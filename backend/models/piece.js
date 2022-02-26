const mongoose = require('mongoose')

const pieceSchema = mongoose.Schema({
  title: String,
  artist: String,
  bpm: Number,
  pages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page'
    }
  ],
})

pieceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Piece', pieceSchema)
