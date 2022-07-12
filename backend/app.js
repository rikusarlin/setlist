//const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const dynamoose = require('dynamoose')
const piecesRouter = require('./controllers/pieces')
const bandsRouter = require('./controllers/bands')
const analyzeRouter = require('./controllers/analyze')
const loginRouter = require('./controllers/login')
const resetRouter = require('./controllers/reset')
const healthRouter = require('./controllers/health')
const setlistRouter = require('./controllers/setlists')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

// FIXME: move to AWS DynamoDB later on
dynamoose.model.defaults.set({
  update: true,
})
dynamoose.aws.ddb.local()
logger.info('hopefully connected to DynamoDB')
/*
  .then(() => {
    logger.info('connected to DynamoDB')
  })
  .catch((error) => {
    logger.error('error in connecting to DynamoDB:', error.message)
  })
*/

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/pieces', piecesRouter)
app.use('/api/bands', bandsRouter)
app.use('/api/login', loginRouter)
app.use('/api/analyze', analyzeRouter)
app.use('/api/reset', resetRouter)
app.use('/health', healthRouter)
app.use('/api/setlist', setlistRouter)

// Add testing router (reset database) in test env
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
