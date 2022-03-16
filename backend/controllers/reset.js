const bcrypt = require('bcrypt')
const resetRouter = require('express').Router()
const Band = require('../models/band')

resetRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    const band = await Band.findOne({ username: body.username })
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

    const updatedBand = new Band({
      username: band.username,
      name: band.name,
      securityQuestion: band.securityQuestion,
      securityAnswerHash: band.securityAnswerHash,
      passwordHash,
    })

    band.overwrite(updatedBand)
    let updatedSavedBand = await band.save()
    if (updatedSavedBand) {
      response.json(updatedSavedBand.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = resetRouter
