const User = require('../models/user')

const newUser = {
  username: 'rikusarlin',
  name: 'Riku Sarlin',
  password: 'salainen',
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  newUser,
  usersInDb,
}
