import React from 'react'
import Togglable from './Togglable'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createBlog } from '../reducers/blogReducer'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { removeReset } from '../utils'


export const NewBlog = (props) => {
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const blogFormRef = React.createRef()

  const handlePost = async (event) => {
    event.preventDefault()

    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = {
        title: title.value,
        author: author.value,
        url: url.value
      }
      props.createBlog(newBlog, props.user.token)
      url.reset()
      title.reset()
      author.reset()
      props.showInfo('added new blog', 3)
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in adding new blog', 3)
    }
  }

  return (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <div>
        <h3>New blog</h3>
        <form onSubmit={handlePost}>
          <div className="form-group row">
            <label htmlFor="Title" className="col-sm-1 col-form-label">Title</label>
            <input className="col-sm-5" data-cy="title" {...removeReset(title)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Author" className="col-sm-1 col-form-label">Author</label>
            <input className="col-sm-5" data-cy="author" {...removeReset(author)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="URL" className="col-sm-1 col-form-label">URL</label>
            <input className="col-sm-5" data-cy="url" {...removeReset(url)}/>
          </div>
          <button type="submit" data-cy="create" className="btn btn-primary">create</button>
        </form>
      </div>
    </Togglable>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  createBlog, showInfo, showError
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewBlog)
