const router = require('express').Router()
const Piece = require('../models/piece')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Piece.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
