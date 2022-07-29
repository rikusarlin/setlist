const bcrypt = require('bcrypt')
const bandsRouter = require('express').Router()
const BandSetlist = require('../models/bandsetlist')
const { v4: uuidv4 } = require('uuid')

bandsRouter.get('/', async (request, response) => {
  const bands = await BandSetlist.query('sk')
    .eq('BAND')
    .attributes(['username', 'name'])
    .using('GSI1')
    .exec()
  response.json(bands.map((b) => b.toJSON()))
})

bandsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    // Validity checks on password and security question & answer... not the hash
    if (!body.username) {
      return response.status(400).json({ error: 'missing username' })
    }
    if (typeof body.password === 'undefined') {
      return response.status(400).json({ error: '`password` is required' })
    }
    if (body.password.length < 3) {
      return response.status(400).json({
        error: `password length ${body.password.length} is shorter than the minimum allowed length (3)`,
      })
    }
    if (body.username.length < 3) {
      return response.status(400).json({
        error: `username ${body.username.length} is shorter than the minimum allowed length (3)`,
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

    // username needs to be unique, if given
    if (body.username) {
      const fetchedBand = await BandSetlist.get({
        pk: `BAND-${body.username}`,
        sk: 'BAND',
      })
      if (fetchedBand) {
        return response
          .status(400)
          .json({ error: 'band with that name already exists' })
      }
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const securityAnswerHash = await bcrypt.hash(
      body.securityAnswer,
      saltRounds
    )

    const band = new BandSetlist({
      pk: `BAND-${body.username}`,
      sk: 'BAND',
      data: `BAND-${body.username}`,
      id: uuidv4(),
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
