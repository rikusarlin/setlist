const dynamoose = require('dynamoose')
const Piece = require('./piece')
const Setlist = require('./setlist')

const bandSchema = new dynamoose.Schema({
  username: {
    type: String,
    validate: (val) => val.length > 2,
    required: true,
    index: true,
    hashKey: true,
  },
  passwordHash: String,
  securityQuestion: String,
  securityAnswerHash: String,
  name: String,
  pieces: {
    type: Array,
    schema: Piece,
  },
  setlists: {
    type: Array,
    schema: Setlist,
  },
})

/*
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
*/

const Band = dynamoose.model('Band', bandSchema)

module.exports = Band
