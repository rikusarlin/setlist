const BandSetlist = require('../models/bandsetlist')

const newBand = {
  username: 'beatles',
  name: 'The Beatles',
  password: 'JohnWasADickhead',
  securityQuestion: 'The Kindergarden',
  securityAnswer: 'Strawberry Fields',
}

const bandsInDb = async () => {
  const bands = await BandSetlist.query('sk')
    .eq('BAND')
    .attributes(['username', 'name'])
    .using('GSI1')
    .exec()
  return bands.map((b) => b.toJSON())
}

module.exports = {
  newBand,
  bandsInDb,
}
