const Piece = require('../models/piece')
const User = require('../models/user')

const initialPieces = [
  {
    'title':'Knockin on Heavens Door',
    'artist':'Bob Dylan',
    'bpm':80,
    'pages':[]
  },
  {
    'title':'Here Comes The Sun',
    'artist':'Beatles',
    'bpm':70,
    'pages':[]
  }
]

var newPiece =   {
  'title':'Simple Man',
  'artist':'Lynyrd Skynyrd',
  'bpm':60,
  'pages':[]
}


const newUser = {
  username: 'rikusarlin',
  name: 'Riku Sarlin',
  password: 'salainen',
}

const piecesInDb = async () => {
  const blogs = await Piece.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialPieces, newPiece, piecesInDb, newUser, usersInDb
}