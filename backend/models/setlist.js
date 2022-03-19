const mongoose = require('mongoose')

const setlistSchema = mongoose.Schema({
  name: String,
  band: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Band',
  },
  pieces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Piece',
    },
  ],
})

setlistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Setlist', setlistSchema)
