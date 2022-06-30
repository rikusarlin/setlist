const dynamoose = require('dynamoose')
const Band = require('./band')
const Piece = require('./piece')

const setlistSchema = new dynamoose.Schema({
  name: String,
  band: Band,
  pieces: {
    type: Array,
    schema: Piece,
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

module.exports = dynamoose.model('Setlist', setlistSchema)
