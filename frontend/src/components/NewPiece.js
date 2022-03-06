import React from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createPiece } from '../reducers/piecesReducer'
import { analyzeContents, clearAnalysis } from '../reducers/analyzeReducer'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { removeReset } from '../utils'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'
import { useState } from 'react'

export const NewPieceNoHistory = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')
  const contents = useField('textarea')
  const [piece, setPiece] = useState()

  const handlePost = async (event) => {
    event.preventDefault()
    try {
      const page = {
        pageNumber: 1,
        rows: props.analaysisResults
      }
      const newPiece = {
        title: title.value,
        artist: artist.value,
        bpm: bpm.value,
        pages: [page],
      }

      props.createPiece(newPiece, props.user.token)
      bpm.reset()
      title.reset()
      artist.reset()
      contents.reset()
      props.history.push('/pieces')
      props.showInfo('added new piece', 3)
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in adding new piece', 3)
    }
  }

  const analyzeContents = async () => {
    const analyzeRequest = {
      contents: contents.value
    }
    await props.analyzeContents(analyzeRequest)
    const newPiece = {
      pages: [],
    }
    const page = {
      pageNumber: 1,
      rows: props.analaysisResults
    }
    newPiece.pages.push(page)
    setPiece(newPiece)
  }

  const returnToPieces = () => {
    props.history.push('/pieces')
    props.clearAnalysis()
  }

  const analyzeOrCreate = props.analysisResult !== null ?
    <button type="submit" data-cy="create" className="col-sm-1 mr-2 btn btn-primary">create</button>
    :
    <button onClick={analyzeContents} data-cy="create" className="col-sm-1 mr-2 btn btn-primary">analyze</button>

  const analyzedOrRaw = props.analysisResult !== null ?
    <PieceRows piece={piece}/>
    :
    <textarea className="col-sm-12" rows="20" data-cy="contents" {...removeReset(contents)}/>

  return (
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
          {analyzedOrRaw}
        </div>
        <div className="form-group">
          {analyzeOrCreate}
          <button onClick={returnToPieces} data-cy="cancel" className="col-sm-1 mr-2 btn btn-primary">cancel</button>
        </div>
      </form>
    </div>
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

const NewPiece = withRouter(NewPieceNoHistory)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPiece)
