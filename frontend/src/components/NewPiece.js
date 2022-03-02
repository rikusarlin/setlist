import React from 'react'
import Togglable from './Togglable'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createPiece } from '../reducers/piecesReducer'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { removeReset } from '../utils'

export const NewPiece = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')

  const pieceFormRef = React.createRef()

  const handlePost = async (event) => {
    event.preventDefault()

    try {
      pieceFormRef.current.toggleVisibility()
      const newPiece = {
        title: title.value,
        author: artist.value,
        bpm: bpm.value
      }
      props.createPiece(newPiece, props.user.token)
      bpm.reset()
      title.reset()
      artist.reset()
      props.showInfo('added new piece', 3)
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in adding new piece', 3)
    }
  }

  return (
    <Togglable buttonLabel="new piece" ref={pieceFormRef}>
      <div>
        <h3>New piece</h3>
        <form onSubmit={handlePost}>
          <div className="form-group row">
            <label htmlFor="Title" className="col-sm-1 col-form-label">Title</label>
            <input className="col-sm-5" data-cy="title" {...removeReset(title)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Artist" className="col-sm-1 col-form-label">Author</label>
            <input className="col-sm-5" data-cy="artist" {...removeReset(artist)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="URL" className="col-sm-1 col-form-label">bpm</label>
            <input className="col-sm-5" data-cy="bpm" {...removeReset(bpm)}/>
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
  createPiece, showInfo, showError
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPiece)
