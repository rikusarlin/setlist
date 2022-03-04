import React from 'react'
import Togglable from './Togglable'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createPiece } from '../reducers/piecesReducer'
import { analyzeContents, clearAnalysis } from '../reducers/analyzeReducer'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { removeReset } from '../utils'

export const NewPiece = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')
  const contents = useField('textarea')

  const pieceFormRef = React.createRef()

  const handlePost = async (event) => {
    event.preventDefault()

    let page = {
      pageNumber: 1,
      rows: []
    }

    const analyzeRequest = {
      contents: contents.value
    }
    props.analyzeContents(analyzeRequest)
    page.rows = props.analysisResult

    try {
      pieceFormRef.current.toggleVisibility()
      const newPiece = {
        title: title.value,
        artist: artist.value,
        bpm: bpm.value,
        pages: [page]
      }
      props.createPiece(newPiece, props.user.token)
      bpm.reset()
      title.reset()
      artist.reset()
      contents.reset()
      props.clearAnalysis()
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
            <label htmlFor="Title" className="col-sm-2 col-form-label">Title</label>
            <input className="col-sm-5" data-cy="title" {...removeReset(title)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Artist" className="col-sm-2 col-form-label">Artist</label>
            <input className="col-sm-5" data-cy="artist" {...removeReset(artist)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Bpm" className="col-sm-2 col-form-label">Bpm</label>
            <input className="col-sm-5" data-cy="bpm" {...removeReset(bpm)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Contents" className="col-sm-2 col-form-label">Contents</label>
            <textarea className="col-sm-8" data-cy="contents" {...removeReset(contents)}/>
          </div>
          <div className="form-group">
            <button type="submit" data-cy="create" className="col-sm-1 btn btn-primary">create</button>
          </div>
        </form>
      </div>
    </Togglable>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    analysisResult: state.analysisResult
  }
}

const mapDispatchToProps = {
  createPiece, showInfo, showError, analyzeContents, clearAnalysis
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPiece)
