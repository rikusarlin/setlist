const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Kela, Jumalasta seuraava',
    author: 'Riku Sarlin',
    url: 'https://sinetti.kela.fi/blogs/Kela_jumalasta_seuraava',
    likes: 23
  },
  {
    title: 'Exploratory testing',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/bliki/ExploratoryTesting.html',
    likes: 470
  }
]

var newBlog = {

  title: 'Use cases considered harmful',
  author: 'A.J.H Simons',
  url: 'https://ieeexplore.ieee.org/document/779012',
  likes: 30
}

const newUser = {
  username: 'rikusarlin',
  name: 'Riku Sarlin',
  password: 'salainen',
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, newBlog, blogsInDb, newUser, usersInDb
}