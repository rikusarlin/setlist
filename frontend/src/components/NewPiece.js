import React from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { analyzeContents, clearAnalysis } from '../reducers/pieceReducer'
import { fetchPieces } from '../reducers/piecesReducer'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { removeReset } from '../utils'
import { withRouter } from 'react-router-dom'

export const NewPieceNoHistory = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')
  const contents = useField('textarea')

  const analyzeContents = async () => {
    let page = {
      pageNumber: 1,
      rows: [],
    }
    let newPiece = {
      title: title.value,
      artist: artist.value,
      bpm: bpm.value,
      pages: [page],
      contents: contents.value,
    }
    try {
      props.analyzeContents(newPiece, props.band.token)
      props.fetchPieces(props.band.token)
      props.showInfo('piece inserted', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in inserting piece', 3)
    }
  }

  const returnToPieces = () => {
    title.reset
    artist.reset
    bpm.reset
    contents.reset
    props.history.push('/pieces')
    props.clearAnalysis()
  }

  return (
    <div>
      <h3>New piece</h3>
      <div className="form-group row">
        <label htmlFor="Title" className="col-sm-2 col-form-label">
          Title
        </label>
        <input className="col-sm-5" data-cy="title" {...removeReset(title)} />
      </div>
      <div className="form-group row">
        <label htmlFor="Artist" className="col-sm-2 col-form-label">
          Artist
        </label>
        <input className="col-sm-5" data-cy="artist" {...removeReset(artist)} />
      </div>
      <div className="form-group row">
        <label htmlFor="Bpm" className="col-sm-2 col-form-label">
          Length (seconds)
        </label>
        <input className="col-sm-5" data-cy="bpm" {...removeReset(bpm)} />
      </div>
      <div className="form-group row">
        <textarea
          className="col-sm-12"
          rows="20"
          data-cy="contents"
          {...removeReset(contents)}
        />
      </div>
      <div className="form-group">
        <button
          onClick={analyzeContents}
          data-cy="analyze"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          analyze
        </button>
        <button
          onClick={returnToPieces}
          data-cy="back"
          className="col-sm-1 mr-2 my-2 btn btn-primary"
        >
          back
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  analyzeContents,
  clearAnalysis,
  fetchPieces,
}

const NewPiece = withRouter(NewPieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(NewPiece)
