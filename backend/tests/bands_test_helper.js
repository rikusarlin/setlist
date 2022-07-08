const Band = require('../models/band')

const newBand = {
  username: 'beatles',
  name: 'The Beatles',
  password: 'JohnWasADickhead',
  securityQuestion: 'The Kindergarden',
  securityAnswer: 'Strawberry Fields',
}

const bandsInDb = async () => {
  const bands = await Band.scan().exec()
  return bands.map((b) => b.toJSON())
}

module.exports = {
  newBand,
  bandsInDb,
}
