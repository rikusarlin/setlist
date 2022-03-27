const healthRouter = require('express').Router()
const mongoose = require('mongoose')
const config = require('../utils/config')

healthRouter.get('/', async (request, response) => {
  mongoose
    .connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      response.status(200).send('OK')
    })
    .catch(() => {
      response.status(200).send('DEAD')
    })
})

module.exports = healthRouter
