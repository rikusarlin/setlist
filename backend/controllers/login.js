const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Band = require('../models/band')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const [band] = await Band.query('username').eq(body.username).exec()
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
    id: band._id,
  }

  const token = jwt.sign(bandForToken, process.env.SECRET)

  response.status(200).send({ token, username: band.username, name: band.name })
})

module.exports = loginRouter
