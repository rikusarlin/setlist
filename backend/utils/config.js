require('dotenv').config()

let PORT = process.env.PORT
let DYNAMODB_URI = process.env.DYNAMODB_URI

if (process.env.NODE_ENV === 'test') {
  DYNAMODB_URI = process.env.DYNAMODB_URI_TEST
}

if (process.env.NODE_ENV === 'dev') {
  DYNAMODB_URI = process.env.DYNAMODB_URI_DEV
}

module.exports = {
  DYNAMODB_URI,
  PORT,
}
