const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

var token
var newUser_username

// Define console functions so that they exist...
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}

const randomStr = function (length) {
  let radom13chars = function () {
    return Math.random().toString(16).substring(2, 15)
  }
  let loops = Math.ceil(length / 13)
  return new Array(loops).fill(radom13chars).reduce((string, func) => {
    return string + func()
  }, '').substring(0, length)
}

beforeAll( async() => {
  debugger;
  var newUser = helper.newUser
  newUser.username = randomStr(16)
  await api.post('/api/users')
    .send(newUser)
  newUser_username = newUser.username
  const res = await api
    .post('/api/login')
    .send({
      username: newUser.username,
      password: helper.newUser.password,
    })
  token = res.body.token
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const newUser = await User.findOne({ username: newUser_username })
  const blogObjects2 = blogObjects.map(blog => {
    blog.user = newUser._id
    return blog
  })
  const promiseArray = blogObjects2.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('fetch all blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    debugger;
    const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })
  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Kela, Jumalasta seuraava')
  })
  test('id field is returned without preceding underscore', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
  })
})

describe('insert new blog', () => {
  test('number of blogs increases when a new blog is added', async () => {
    await api.post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length+1)
  })
  test('an inserted blog can be found after addition', async () => {
    await api.post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(helper.newBlog.title)
  })
  test('an inserted blog with no likes result in blog with 0 likes', async () => {
    delete helper.newBlog.likes
    const response = await api.post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBe(0)
  })
  test('title is required', async () => {
    delete helper.newBlog.title
    await api.post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newBlog).expect(400)
  })
  test('url is required', async () => {
    delete helper.newBlog.url
    await api.post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(helper.newBlog).expect(400)
  })
})

describe('view a specific blog', () => {
  test('viewing succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultBlog.body.toString()).toEqual(blogToView.toString())
  })
  test('does not succeed with 404 status when called with non-existing but valid id', async () => {
    await api
      .get('/api/blogs/5dfa698896cfe676450a2916')
      .set('Authorization', `bearer ${token}`)
      .expect(404)
  })
  test('invalid id results in 400 status', async () => {
    await api
      .get('/api/blogs/3457896543')
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })
})

describe('delete blog', () => {
  test('deletion succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  })
  test('succeeds with 204 status when called with non-existing but valid id', async () => {
    await api
      .delete('/api/blogs/5dfa698896cfe676450a2916')
      .set('Authorization', `bearer ${token}`)
      .expect(204)
  })
  test('invalid id results in 400 status', async () => {
    await api
      .delete('/api/blogs/3457896543')
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })
})

describe('update blog', () => {
  test('update number of likes in blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const likesBeforeUpdate = blogToUpdate.likes
    blogToUpdate.likes ++
    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const resultBlog = await api
      .get(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultBlog.body.likes).toBe(likesBeforeUpdate+1)
  })
  test('fails with 404 status when called with non-existing but valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    var blogToUpdate = blogsAtStart[0]
    await api
      .put('/api/blogs/5dfa698896cfe676450a2916')
      .set('Authorization', `bearer ${token}`)
      .send(blogToUpdate)
      .expect(404)
  })
  test('invalid id results in 400 status', async () => {
    const blogsAtStart = await helper.blogsInDb()
    var blogToUpdate = blogsAtStart[0]
    await api
      .put('/api/blogs/3457896543')
      .set('Authorization', `bearer ${token}`)
      .send(blogToUpdate)
      .expect(400)
  })
  test('update without title results in 400', async () => {
    const blogsAtStart = await helper.blogsInDb()
    var blogToUpdate = blogsAtStart[0]
    delete blogToUpdate.title
    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(blogToUpdate).expect(400)
  })
  test('update without url results in 400', async () => {
    const blogsAtStart = await helper.blogsInDb()
    var blogToUpdate = blogsAtStart[0]
    delete blogToUpdate.url
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(blogToUpdate).expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})