const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const { piecesRouter } = require('./controllers/pieces')
const bandsRouter = require('./controllers/bands')
const analyzeRouter = require('./controllers/analyze')
const loginRouter = require('./controllers/login')
const resetRouter = require('./controllers/reset')
const setlistRouter = require('./controllers/setlists')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.set('useCreateIndex', true)
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

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
app.use('/api/setlist', setlistRouter)

// Add testing router (reset database) in test env
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
