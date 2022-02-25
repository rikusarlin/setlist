const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {

  if(blogs.length === 0){
    return null
  }

  const allLikes = blogs.map(blog => blog.likes)
  const indexOfMaxValue = allLikes.indexOf(Math.max(...allLikes))

  return blogs[indexOfMaxValue]
}

const mostBlogs = blogs => {
  if(blogs.length === 0){
    return null
  }

  const mostBlogsAuthor = _(blogs)
    .groupBy('author')
    .map((value, key) => ({ author: key, blogs:value.length }))
    .orderBy('blogs', 'desc')
    .value()[0]
  return mostBlogsAuthor
}

const sumByProp = function(items, prop){
  return items.reduce( function(a, b){
    return a + b[prop]
  }, 0)
}

const mostLikes = blogs => {
  if(blogs.length === 0){
    return null
  }

  const mostLikesAuthor = _(blogs)
    .groupBy('author')
    .map((value, key) => ({ author: key, likes:sumByProp(value, 'likes') }))
    .orderBy('likes', 'desc')
    .value()[0]
  return mostLikesAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}