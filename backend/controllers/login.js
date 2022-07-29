const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const BandSetlist = require('../models/bandsetlist')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  var band = await BandSetlist.get({
    pk: `BAND-${body.username}`,
    sk: 'BAND',
  })
  const passwordCorrect = !band
    ? false
    : await bcrypt.compare(body.password, band.passwordHash)

  if (!(band && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const bandForToken = {
    username: band.username,
    id: band.id,
  }

  const token = jwt.sign(bandForToken, process.env.SECRET)

  response.status(200).send({ token, username: band.username, name: band.name })
})

module.exports = loginRouter
