const mongoose = require('mongoose')

const bandSchema = mongoose.Schema({
  name: String,
  pieces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Piece',
    },
  ],
  setlists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Setlist',
    },
  ],
})

bandSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Band', bandSchema)
