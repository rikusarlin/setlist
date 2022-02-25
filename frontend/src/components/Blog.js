import React from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import  { useField } from '../hooks'
import { removeReset } from '../utils'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const BlogNoHistory = (props)  => {
  const comment = useField('text')

  if ( props.blog === undefined || props.blog === null){
    return <div/>
  }

  const handleComment = async (event) => {
    event.preventDefault()

    try {
      const newComment = {
        comment: comment.value
      }
      props.commentBlog(props.blog.id, newComment, props.user.token)
      comment.reset()
      props.showInfo(`commented on blog '${props.blog.title}'`, 3)
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in commenting blog', 3)
    }
  }


  const handleLike = async (event) => {
    event.preventDefault()

    try {
      const updatedBlog = {
        id: props.blog.id,
        title: props.blog.title,
        author: props.blog.author,
        url: props.blog.url,
        likes: props.blog.likes
      }
      props.likeBlog(updatedBlog, props.user.token)
      props.showInfo('liked a blog', 3)
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in updating likes', 3)
    }
  }

  const handleDelete = async () => {
    try {
      props.deleteBlog(props.blog.id, props.user.token)
      props.showInfo('blog deleted', 3)
      props.history.push('/blogs')
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in deleting blog', 3)
    }
  }

  const confirmDelete = () => {
    if(window.confirm(`remove blog ${props.blog.title} by ${props.blog.author}?`)){
      handleDelete()
    }

  }

  const commentList = props.blog.comments.map(comment =>
    <li key={comment}>{comment}</li>
  )

  const commentForm =
    <form onSubmit={handleComment}>
      <div className="form-group row">
        <input className="col-sm-3" {...removeReset(comment)}/>
        <button type="submit" className="btn btn-primary">add comment</button>
      </div>
    </form>


  if(props.user.username !== null){

    let deleteBlog = <button className="btn btn-danger" type="button" onClick={confirmDelete}>delete</button>
    if(props.user.username !== props.blog.user.username){
      deleteBlog = <div/>
    }

    let comments =
      <div>
        <b>Comments</b><br/>
        {commentForm}
        <ul>
          {commentList}
        </ul>
      </div>
    if(props.blog.comments.length <= 0){
      comments =
        <div>
          <b>No comments yet</b>
          {commentForm}
        </div>
    }

    return(
      <div className="blog">
        <div>
          <h2>{props.blog.title} {props.blog.author}</h2>
          <a href={props.blog.url}>{props.blog.url}</a> <br/>
          <form onSubmit={handleLike}>
            {props.blog.likes} likes <button className="btn btn-primary" data-cy="like" type="submit">like</button><br/>
          </form>
          added by {props.blog.user.name}<br/>
          {deleteBlog}<br/>
          {comments}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  showInfo, showError, likeBlog, deleteBlog, commentBlog
}

const Blog = withRouter(BlogNoHistory)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Blog)
