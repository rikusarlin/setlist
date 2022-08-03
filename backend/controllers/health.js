const healthRouter = require('express').Router()
const dynamoose = require('dynamoose')
const config = require('../utils/config')
const BandSetlist = require('../models/bandsetlist')

healthRouter.get('/', async (request, response) => {
   dynamoose.aws.ddb.local()
   BandSetlist.query('sk').eq('BAND').using('GSI1').exec()
    .then(() => {
      response.status(200).send('OK')
    })
    .catch(() => {
      response.status(200).send('DEAD')
    })
})

module.exports = healthRouter
