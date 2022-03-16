const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bandSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 3,
    required: true,
  },
  passwordHash: String,
  securityQuestion: String,
  securityAnswerHash: String,
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

bandSchema.plugin(uniqueValidator)

bandSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash and securityQuestionHash should not be revealed
    delete returnedObject.passwordHash
    delete returnedObject.securityAnswerHash
  },
})

const Band = mongoose.model('Band', bandSchema)

module.exports = Band
