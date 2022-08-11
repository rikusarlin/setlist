const bcrypt = require('bcrypt')
const resetRouter = require('express').Router()
const BandSetlist = require('../models/bandsetlist')

resetRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (!body.username) {
      return response.status(401).json({
        error: 'invalid username or security answer',
      })
    }
    const band = await BandSetlist.get({
      pk: `BAND-${body.username}`,
      sk: 'BAND',
    })
    const securityAnswerCorrect =
      band === null
        ? false
        : await bcrypt.compare(body.securityAnswer, band.securityAnswerHash)

    if (!(band && securityAnswerCorrect)) {
      return response.status(401).json({
        error: 'invalid username or security answer',
      })
    }

    if (typeof body.newPassword === 'undefined') {
      return response.status(400).json({ error: '`newPassword` is required' })
    }
    if (body.newPassword.length < 3) {
      return response.status(400).json({
        error: `nwe password length ${body.newPassword.length} is shorter than the minimum allowed length (3)`,
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.newPassword, saltRounds)

    const updatedBand = new BandSetlist({
      pk: `BAND-${body.username}`,
      sk: 'BAND',
      data: `BAND-${body.username}`,
      id: band.id,
      username: band.username,
      name: band.name,
      securityQuestion: band.securityQuestion,
      securityAnswerHash: band.securityAnswerHash,
      pieces: band.pieces,
      setlists: band.setlists,
      passwordHash,
    })

    let updatedSavedBand = band.save(updatedBand)
    if (updatedSavedBand) {
      response.json(updatedSavedBand)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = resetRouter
