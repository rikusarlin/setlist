const router = require('express').Router()
const Piece = require('../models/piece')
const Band = require('../models/band')

router.post('/reset', async (request, response) => {
  await Piece.deleteMany({})
  await Band.deleteMany({})

  response.status(204).end()
})

module.exports = router
