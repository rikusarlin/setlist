import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece } from '../reducers/piecesReducer'
import { fetchPiece, emptyPiece } from '../reducers/pieceReducer'
import {
  updatePiece,
  analyzeContents,
  clearAnalysis,
  transposeDown,
  transposeUp,
  setPiece,
} from '../reducers/analyzeReducer'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { removeReset } from '../utils'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'

export const EditPieceNoHistory = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')
  const contents = useField('textarea')
  useEffect(() => {
    async function fetchData() {
      if (props.pieceId !== undefined) {
        await props.fetchPiece(props.pieceId, props.user.token)
        props.setPiece(props.piece)
        title.set(props.analyzedPiece.title)
        artist.set(props.analyzedPiece.artist)
        bpm.set(props.analyzedPiece.bpm)
      }
    }
    fetchData()
  }, [props.user.token, props.fetchPiece, props.pieceId, title, artist, bpm])

  const updateContents = async () => {
    try {
      let newPiece = props.analyzedPiece
      newPiece.title = title.value
      newPiece.artist = artist.value
      newPiece.bpm = bpm.value

      props.updatePiece(newPiece, props.user.token)
      props.showInfo('piece updated', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in updating piece', 3)
    }
  }

  const transposeUp = async () => {
    try {
      props.transposeUp(props.analyzedPiece, props.user.token)
      props.showInfo('piece transposed up', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in transposing piece up', 3)
    }
  }

  const deletePiece = async () => {
    try {
      title.reset()
      artist.reset()
      bpm.reset()
      contents.reset()
      props.deletePiece(props.analyzedPiece.id, props.user.token)
      props.clearAnalysis()
      props.showInfo('piece deleted', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting piece', 3)
    }
  }

  const confirmDelete = () => {
    if (
      window.confirm(
        `Remove ${props.analyzedPiece.title} by ${props.analyzedPiece.artist}?`
      )
    ) {
      deletePiece()
    }
  }

  const transposeDown = async () => {
    try {
      props.transposeDown(props.analyzedPiece, props.user.token)
      props.showInfo('piece transposed down', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in transposing piece down', 3)
    }
  }

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
    props.analyzeContents(newPiece)
  }

  const editContents = async () => {
    props.clearAnalysis()
    const rowContents = props.analyzedPiece.pages.map((page) =>
      page.rows.map((row) => row.contents).join('\n')
    )
    contents.set(rowContents[0])
  }

  const returnToPieces = () => {
    title.reset
    artist.reset
    bpm.reset
    contents.reset
    props.history.push('/pieces')
    props.clearAnalysis()
  }

  const editOrAnalyze =
    props.analyzedPiece !== null ? (
      <div>
        <button
          onClick={updateContents}
          data-cy="update"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          update
        </button>
        <button
          onClick={editContents}
          data-cy="edit"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          edit
        </button>
        <button
          onClick={transposeUp}
          data-cy="transposeUp"
          className="col-sm-2 mr-2 btn btn-primary"
        >
          transpose up
        </button>
        <button
          onClick={transposeDown}
          data-cy="transposeDown"
          className="col-sm-2 mr-2 btn btn-primary"
        >
          transpose down
        </button>
        <button
          onClick={confirmDelete}
          data-cy="deletePiece"
          className="col-sm-2 mr-2 btn btn-danger"
        >
          delete
        </button>
      </div>
    ) : (
      <button
        onClick={analyzeContents}
        data-cy="analyze"
        className="col-sm-1 mr-2 btn btn-primary"
      >
        analyze
      </button>
    )

  const analyzedOrRaw =
    props.analyzedPiece !== null ? (
      <PieceRows piece={props.analyzedPiece} />
    ) : (
      <textarea
        className="col-sm-12"
        rows="20"
        data-cy="contents"
        {...removeReset(contents)}
      />
    )

  const newOrEdit =
    props.analyzedPiece !== null ? <h3>Edit piece</h3> : <h3>New piece</h3>

  return (
    <div>
      {newOrEdit}
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
          Bpm
        </label>
        <input className="col-sm-5" data-cy="bpm" {...removeReset(bpm)} />
      </div>
      <div className="form-group row">{analyzedOrRaw}</div>
      <div className="form-group">
        {editOrAnalyze}
        <button
          onClick={returnToPieces}
          data-cy="cancel"
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
    user: state.user,
    analyzedPiece: state.analyzedPiece,
    piece: state.piece,
  }
}

const mapDispatchToProps = {
  updatePiece,
  showInfo,
  showError,
  analyzeContents,
  clearAnalysis,
  transposeDown,
  transposeUp,
  deletePiece,
  fetchPiece,
  emptyPiece,
  setPiece,
}

const EditPiece = withRouter(EditPieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(EditPiece)
