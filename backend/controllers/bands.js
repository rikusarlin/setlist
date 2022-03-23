const bcrypt = require('bcrypt')
const bandsRouter = require('express').Router()
const Band = require('../models/band')

bandsRouter.get('/', async (request, response) => {
  const bands = await Band.find({})
  response.json(bands.map((b) => b.toJSON()))
})

bandsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    // Validity checks on password and security question & answer... not the hash
    if (typeof body.password === 'undefined') {
      return response.status(400).json({ error: '`password` is required' })
    }
    if (body.password.length < 3) {
      return response.status(400).json({
        error: `password length ${body.password.length} is shorter than the minimum allowed length (3)`,
      })
    }
    if (typeof body.securityQuestion === 'undefined') {
      return response
        .status(400)
        .json({ error: '`securityQuestion` is required' })
    }
    if (typeof body.securityAnswer === 'undefined') {
      return response
        .status(400)
        .json({ error: '`securityAnswer` is required' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const securityAnswerHash = await bcrypt.hash(
      body.securityAnswer,
      saltRounds
    )

    const band = new Band({
      username: body.username,
      name: body.name,
      securityQuestion: body.securityQuestion,
      securityAnswerHash,
      passwordHash,
    })

    const savedBand = await band.save()

    response.json(savedBand)
  } catch (exception) {
    next(exception)
  }
})

module.exports = bandsRouter
