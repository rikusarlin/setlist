import React from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createPiece } from '../reducers/piecesReducer'
import { analyzeContents, clearAnalysis, changeRowType, changeContents } from '../reducers/analyzeReducer'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { removeReset } from '../utils'
import { withRouter } from 'react-router-dom'
import EditablePieceRows from './EditablePieceRows'

export const NewPieceNoHistory = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')
  const contents = useField('textarea')

  const handlePost = async (event) => {
    event.preventDefault()
    try {
      let newPiece = props.analyzedPiece
      newPiece.title = title.value
      newPiece.artist = artist.value
      newPiece.bpm = bpm.value

      props.createPiece(newPiece, props.user.token)
      bpm.reset()
      title.reset()
      artist.reset()
      contents.reset()
      //props.history.push('/pieces')
      props.showInfo('added new piece', 3)
      props.clearAnalysis()
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in adding new piece', 3)
    }
  }

  const handleFieldChange = async (event) => {
    event.preventDefault()
    try {
      const [page, row] = event.target.id.split('_')
      console.log(`handleFieldChange, page ${page}, row ${row}, field ${event.target.name}, new value: ${event.target.value} `)
      if(event.target.name === 'rowType'){
        props.changeRowType(page, row, event.target.value)
      } else if (event.target.name === 'contents'){
        props.changeContents(page, row, event.target.value)
      }
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in handling field change', 3)
    }
  }

  const analyzeContents = async () => {
    let page = {
      pageNumber: 1,
      rows: []
    }
    let newPiece = {
      title: title.value,
      artist: artist.value,
      bpm: bpm.value,
      pages: [page],
      contents: contents.value
    }
    props.analyzeContents(newPiece)
  }

  const returnToPieces = () => {
    props.history.push('/pieces')
    props.clearAnalysis()
  }

  const analyzeOrCreate = props.analyzedPiece !== null ?
    <button type="submit" data-cy="create" className="col-sm-1 mr-2 btn btn-primary">create</button>
    :
    <button onClick={analyzeContents} data-cy="analyze" className="col-sm-1 mr-2 btn btn-primary">analyze</button>

  const analyzedOrRaw = props.analyzedPiece !== null ?
    <EditablePieceRows piece={props.analyzedPiece} handleFieldChange={handleFieldChange}/>
    :
    <textarea className="col-sm-12" rows="20" data-cy="contents" {...removeReset(contents)}/>

  return (
    <div>
      <h3>New piece</h3>
      <form onSubmit={handlePost} onChange={handleFieldChange}>
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
          <button onClick={returnToPieces} data-cy="cancel" className="col-sm-1 mr-2 btn btn-primary">back</button>
        </div>
      </form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    analyzedPiece: state.analyzedPiece
  }
}

const mapDispatchToProps = {
  createPiece, showInfo, showError, analyzeContents, clearAnalysis, changeContents, changeRowType
}

const NewPiece = withRouter(NewPieceNoHistory)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPiece)
