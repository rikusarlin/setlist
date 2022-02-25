import blogService from '../services/blogs'

export const likeBlog = (blogToLike, token) => {
  return async dispatch => {
    const content = {
      ...blogToLike,
      likes: blogToLike.likes +1
    }
    const updatedBlog = await blogService.update(content, token)
    dispatch({
      type: 'LIKE_BLOG',
      data: updatedBlog
    })
  }
}

export const commentBlog = (id, comment, token) => {
  return async dispatch => {
    const updatedBlog = await blogService.comment(id, comment, token)
    dispatch({
      type: 'COMMENT_BLOG',
      data: updatedBlog
    })
  }
}

export const deleteBlog = (blogId, token) => {
  return async dispatch => {
    const response = await blogService.deleteBlog(blogId, token)
    console.log(`In deleteBlog (id ${blogId}), response: ${response}`)
    dispatch({
      type: 'DELETE_BLOG',
      data: blogId
    })
  }
}

export const createBlog = (content, token) => {
  return async dispatch => {
    const newBlog = await blogService.create(content, token)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const fetchBlogs = (token) => {
  console.log('In blogReducer.fetchBlogs, token: ',token)
  return async dispatch => {
    const blogs = await blogService.getAll(token)
    console.log('Blogs.length: ',blogs.length)
    dispatch({
      type: 'FETCH_BLOGS',
      data: blogs,
    })
  }
}

export const emptyBlogList = () => {
  return async dispatch => {
    dispatch({
      type: 'EMPTY_BLOG_LIST',
      data: null,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in blogReducer: ', state)
  console.log('action in blogReducer', action)

  switch(action.type) {
  case 'NEW_BLOG':
    return [...state, action.data]
  case 'LIKE_BLOG':
  case 'COMMENT_BLOG':
    return state.map(blog =>
      blog.id !== action.data.id ? blog : action.data
    )
  case 'DELETE_BLOG':
    return state.filter(blog =>
      blog.id !== action.data
    )
  case 'FETCH_BLOGS':
    return action.data
  case 'EMPTY_BLOG_LIST':
    return null
  default:
    return state
  }
}

export default reducer