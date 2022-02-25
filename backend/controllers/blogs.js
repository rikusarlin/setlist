const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    //logger.info('In blogsRouter.get all, results:', blogs)
    response.json(blogs)
  } catch (error) {
    //logger.info('In blogsRouter.error:', error)
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  let blog = new Blog(request.body)

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if(typeof blog.title === 'undefined'){
      return response.status(400).json({ error:'title is required' })
    }
    if(typeof blog.url === 'undefined'){
      return response.status(400).json({ error:'url is required' })
    }
    if(typeof blog.likes === 'undefined'){
      blog.likes = 0
    }

    blog.user = user._id

    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
    const newBlog2 = await Blog.findById(newBlog._id).populate('user', { username: 1, name: 1 })
    response.status(201).json(newBlog2.toJSON())
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 })

    if(blog){
      res.json(blog.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const tokenUser = await User.findById(decodedToken.id)
    logger.info('tokenUser: ',tokenUser)
    logger.info('id: ',req.params.id)
    const blogToDelete =  await Blog.findById(req.params.id)
    logger.info('blogToDelete: ',blogToDelete)

    if( !blogToDelete){
      return res.status(204).end()
    }

    if ( blogToDelete.user.toString() === tokenUser._id.toString() ) {
      await Blog.findByIdAndRemove(req.params.id).setOptions({ 'useFindAndModify':false })
      // delete blog from user direction, don't if this is actually necessary
      await tokenUser.blogs.remove(req.params.id)
      await tokenUser.save()
      res.status(204).end()
    } else {
      return res.status(401).end()
    }
  } catch(error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    if(typeof req.body.title === 'undefined'){
      return res.status(400).json({ error:'title is required' })
    }
    if(typeof req.body.url === 'undefined'){
      return res.status(400).json({ error:'url is required' })
    }
    let blog = {
      title: req.body.title,
      author: req.body.author,
      url: req.body.url,
      likes: req.body.likes
    }
    if(typeof req.body.likes === 'undefined'){
      blog.likes = 0
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog,
      { new: true, runValidators: false, context: 'query', useFindAndModify:false })
    const updatedBlog2 = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 })
    if(updatedBlog){
      res.json(updatedBlog2.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', async (req, res, next) => {
  try {
    if(typeof req.body.comment === 'undefined'){
      return res.status(400).json({ error:'comment is required' })
    }
    const blogToUpdate = await Blog.findById(req.params.id)
    if(blogToUpdate){
      blogToUpdate.comments.push(req.body.comment)
      await blogToUpdate.save()
      const updatedBlog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 })
      res.json(updatedBlog.toJSON())
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
