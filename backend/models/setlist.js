const dynamoose = require('dynamoose')
//const Band = require('./band')
//const Piece = require('./piece')

const setlistSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
  },
  name: String,
  band: String,
  pieces: {
    type: Array,
    schema: [String],
  },
})

/*
setlistSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
*/

module.exports = dynamoose.model('Setlist', setlistSchema, { update: true })
