import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece } from '../reducers/piecesReducer'
import { fetchPiece, emptyPiece } from '../reducers/pieceReducer'
import { changePieceData } from '../reducers/editPieceReducer'
import {
  updatePiece,
  analyzeContents,
  clearAnalysis,
  transposeDown,
  transposeUp,
  setPiece,
} from '../reducers/analyzeReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'

export const EditPieceNoHistory = (props) => {
  useEffect(() => {
    async function fetchData() {
      if (props.pieceId !== undefined) {
        await props.fetchPiece(props.pieceId, props.user.token)
        props.setPiece(props.piece)
        props.changePieceData(props.piece)
      }
    }
    fetchData()
  }, [props.user.token, props.fetchPiece, props.pieceId, props.changePieceData])

  const updateContents = async () => {
    try {
      let newPiece = props.analyzedPiece
      newPiece.title = props.editedPiece.title
      newPiece.artist = props.editedPiece.artist
      newPiece.bpm = props.editedPiece.bpm

      props.updatePiece(newPiece, props.user.token)
      props.changePieceData(props.piece)
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
      title: props.editedPiece.title,
      artist: props.editedPiece.artist,
      bpm: props.editedPiece.bpm,
      pages: [page],
      contents: props.editedPiece.contents,
    }
    props.analyzeContents(newPiece)
  }

  const getRowContents = () => {
    const rowContents = props.analyzedPiece.pages.map((page) =>
      page.rows.map((row) => row.contents).join('\n')
    )
    return rowContents[0]
  }

  const editContents = async () => {
    props.clearAnalysis()
  }

  const handleTitleChange = async (event) => {
    const newPiece = {
      title: event.target.value,
      artist: props.editedPiece.artist,
      bpm: props.editedPiece.bpm,
      pages: props.editedPiece.pages,
    }
    newPiece.contents = getRowContents()
    props.changePieceData(newPiece)
  }

  const handleArtistChange = async (event) => {
    const newPiece = {
      artist: event.target.value,
      title: props.editedPiece.title,
      bpm: props.editedPiece.bpm,
      pages: props.editedPiece.pages,
    }
    newPiece.contents = getRowContents()
    props.changePieceData(newPiece)
  }

  const handleBpmChange = async (event) => {
    const newPiece = {
      bpm: event.target.value,
      title: props.editedPiece.title,
      artist: props.editedPiece.artist,
      pages: props.editedPiece.pages,
    }
    newPiece.contents = getRowContents()
    props.changePieceData(newPiece)
  }

  const handleContentChange = async (event) => {
    const newPiece = {
      bpm: props.editedPiece.bpm,
      title: props.editedPiece.title,
      artist: props.editedPiece.artist,
      pages: props.editedPiece.pages,
      content: event.target.value,
    }
    props.changePieceData(newPiece)
  }

  const returnToPieces = () => {
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
        name="contents"
        data-cy="contents"
        onChange={handleContentChange}
      />
    )

  return (
    <div>
      <h3>Edit piece</h3>
      <div className="form-group row">
        <label htmlFor="Title" className="col-sm-2 col-form-label">
          Title
        </label>
        <input
          className="col-sm-5"
          name="title"
          data-cy="title"
          value={props.editedPiece.title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="form-group row">
        <label htmlFor="Artist" className="col-sm-2 col-form-label">
          Artist
        </label>
        <input
          className="col-sm-5"
          name="artist"
          data-cy="artist"
          value={props.editedPiece.artist}
          onChange={handleArtistChange}
        />
      </div>
      <div className="form-group row">
        <label htmlFor="Bpm" className="col-sm-2 col-form-label">
          Bpm
        </label>
        <input
          className="col-sm-5"
          name="bpm"
          data-cy="bpm"
          value={props.editedPiece.bpm}
          onChange={handleBpmChange}
        />
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
    editedPiece: state.editedPiece,
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
  changePieceData,
}

const EditPiece = withRouter(EditPieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(EditPiece)
