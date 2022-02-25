const listHelper = require('../utils/list_helper')

// Define console functions so that they exist...
global.console = {
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}
const emptyBlogList = []

const blogList1 = [
  {
    'title':'Exploratory testing',
    'author':'Martin Fowler',
    'url':'https://martinfowler.com/bliki/ExploratoryTesting.html',
    'likes':470
  }
]

const blogList2 = [
  {
    'title':'Exploratory testing',
    'author':'Martin Fowler',
    'url':'https://martinfowler.com/bliki/ExploratoryTesting.html',
    'likes':470
  },
  {
    'title':'Kela, Jumalasta seuraava',
    'author':'Riku Sarlin',
    'url':'https://sinetti.kela.fi/blogi/Lists/Viestit/Post.aspx?ID=149',
    'likes':20
  }
]

const blogListEqual = [
  {
    'title':'Exploratory testing',
    'author':'Martin Fowler',
    'url':'https://martinfowler.com/bliki/ExploratoryTesting.html',
    'likes':470
  },
  {
    'title':'Kela, Jumalasta seuraava',
    'author':'Riku Sarlin',
    'url':'https://sinetti.kela.fi/blogi/Lists/Viestit/Post.aspx?ID=149',
    'likes':470
  }
]

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

describe('dummy', () => {
  test('dummy returns one', () => {
    const result = listHelper.dummy()
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('of 6-item list with some likes should be the sum of likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(blogs[0].likes+blogs[1].likes+blogs[2].likes+blogs[3].likes+blogs[4].likes+blogs[5].likes)
  })
  test('of 2-item list with some likes should be the sum of likes', () => {
    const result = listHelper.totalLikes(blogList2)
    expect(result).toBe(blogList2[0].likes + blogList2[1].likes)
  })
  test('of 1-item list with some likes should be the number of likes of that item', () => {
    const result = listHelper.totalLikes(blogList1)
    expect(result).toBe(blogList1[0].likes)
  })
  test('of emtpy list should be zero', () => {
    const result = listHelper.totalLikes(emptyBlogList)
    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {
  test('of 6-item list with differing number of likes should be the one with most', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })
  test('of 2-item list with differing number of likes should be the one with more likes', () => {
    const result = listHelper.favoriteBlog(blogList2)
    expect(result).toEqual(blogList2[0])
  })
  test('of 1-item list should be that item ', () => {
    const result = listHelper.favoriteBlog(blogList1)
    expect(result).toEqual(blogList1[0])
  })
  test('of empty list should be null ', () => {
    const result = listHelper.favoriteBlog(emptyBlogList)
    expect(result).toEqual(null)
  })
})

describe('most blogs', () => {
  test('of empty list should be null', () => {
    const result = listHelper.mostBlogs(emptyBlogList)
    expect(result).toEqual(null)
  })
  test('of 6-item list with 3 authors with 1, 2, and 3 blogs should be the one with 3', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Robert C. Martin', blogs: 3 })
  })
  test('of 1-item list should be the only author', () => {
    const result = listHelper.mostBlogs(blogList1)
    expect(result).toEqual({ author: 'Martin Fowler', blogs: 1 })
  })
  test('of 2-item list should be either', () => {
    const result = listHelper.mostBlogs(blogList2)
    expect([{ author: 'Martin Fowler', blogs: 1 },{ author: 'Riku Sarlin', blogs: 1 }]).toContainEqual(result)
  })
})

describe('most likes', () => {
  test('of empty list should be null', () => {
    const result = listHelper.mostLikes(emptyBlogList)
    expect(result).toEqual(null)
  })
  test('of 6-item list with 3 authors with 7, 5+12, and 10+0+2 likes should be the one with 5+12 likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
  test('of 2-item list with 2 authors with 470 and 20 likes should be one with 470 likes', () => {
    const result = listHelper.mostLikes(blogList2)
    expect(result).toEqual({ author: 'Martin Fowler', likes: 470 })
  })
  test('of 1-item list with should be that author', () => {
    const result = listHelper.mostLikes(blogList1)
    expect(result).toEqual({ author: 'Martin Fowler', likes: 470 })
  })
  test('of 2-item list with 2 authors with 470 and 470 likes should be either', () => {
    const result = listHelper.mostLikes(blogListEqual)
    expect([{ author: 'Martin Fowler', likes: 470 },{ author: 'Riku Sarlin', likes: 470 }]).toContainEqual(result)
  })
})