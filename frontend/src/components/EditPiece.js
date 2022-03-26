import React, { useEffect, useState } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece, fetchPieces } from '../reducers/piecesReducer'
import {
  updatePiece,
  analyzeContents,
  clearAnalysis,
  transposeDown,
  transposeUp,
  setPiece,
  fetchPiece,
} from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'

export const EditPieceNoHistory = (props) => {
  const [previousPiece, setPreviousPiece] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    bpm: 0,
    contents: '',
  })
  useEffect(() => {
    const fetchData = async () => {
      await props.fetchPiece(props.pieceId, props.band.token)
    }
    fetchData()
  }, [props.band.token, props.pieceId, props.fetchPiece])

  useEffect(() => {
    if (props.piece !== null) {
      const startFormData = {
        title: props.piece.title,
        artist: props.piece.artist,
        bpm: props.piece.bpm,
        contents: getRowContents(props.pages),
      }
      setFormData(startFormData)
    }
  }, [props.piece])

  const updateContents = async () => {
    try {
      let newPiece = props.piece
      newPiece.title = formData.title
      newPiece.artist = formData.artist
      newPiece.bpm = formData.bpm

      props.updatePiece(newPiece, props.band.token)
      props.showInfo('piece updated', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in updating piece', 3)
    }
  }

  const transposeUp = async () => {
    try {
      props.transposeUp(props.piece, props.band.token)
      props.showInfo('piece transposed up', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in transposing piece up', 3)
    }
  }

  const deletePiece = async () => {
    try {
      props.deletePiece(props.piece.id, props.band.token)
      props.clearAnalysis()
      props.history.push('/pieces')
      props.showInfo('piece deleted', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting piece', 3)
    }
  }

  const confirmDelete = () => {
    if (
      window.confirm(`Remove ${props.piece.title} by ${props.piece.artist}?`)
    ) {
      deletePiece()
    }
  }

  const transposeDown = async () => {
    try {
      props.transposeDown(props.piece, props.band.token)
      props.showInfo('piece transposed down', 3)
      props.changePieceData(props.piece)
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
      title: formData.title,
      artist: formData.artist,
      bpm: formData.bpm,
      pages: [page],
      contents: formData.contents,
    }
    try {
      props.analyzeContents(newPiece, props.band.token)
      props.deletePiece(previousPiece.id, props.band.token)
      props.fetchPieces(props.band.token)
      props.showInfo('piece re-analyzed', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in re-analyzing piece', 3)
    }
  }

  const getRowContents = () => {
    let rowContents = []
    if (props.piece.pages !== null && props.piece.pages !== undefined) {
      rowContents = props.piece.pages.map((page) =>
        page.rows.map((row) => row.contents).join('\n')
      )
    }
    return rowContents[0]
  }

  const editContents = async () => {
    setPreviousPiece(props.piece)
    props.clearAnalysis()
  }

  const cancelEdit = async () => {
    props.setPiece(previousPiece)
  }

  const returnToPieces = () => {
    props.history.push('/pieces')
    props.clearAnalysis()
  }

  const editOrAnalyze =
    props.piece !== null ? (
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
      <div>
        <button
          onClick={analyzeContents}
          data-cy="analyze"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          analyze
        </button>
        <button
          onClick={cancelEdit}
          data-cy="cancel"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          cancel
        </button>
      </div>
    )

  const analyzedOrRaw =
    props.piece !== null ? (
      <PieceRows piece={props.piece} />
    ) : (
      <textarea
        className="col-sm-12"
        rows="20"
        name="contents"
        id="conenents"
        data-cy="contents"
        value={formData.contents}
        onChange={(e) => setFormData({ ...formData, contents: e.target.value })}
      />
    )

  return (
    <div className="container">
      <h3>Edit piece</h3>
      <div className="form-group row">
        <label htmlFor="Title" className="col-sm-2 col-form-label">
          Title
        </label>
        <input
          className="col-sm-5"
          name="title"
          id="title"
          data-cy="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="form-group row">
        <label htmlFor="Artist" className="col-sm-2 col-form-label">
          Artist
        </label>
        <input
          className="col-sm-5"
          name="artist"
          id="artist"
          data-cy="artist"
          value={formData.artist}
          onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
        />
      </div>
      <div className="form-group row">
        <label htmlFor="Bpm" className="col-sm-2 col-form-label">
          Length (seconds)
        </label>
        <input
          className="col-sm-5"
          name="bpm"
          id="bpm"
          data-cy="bpm"
          value={formData.bpm}
          onChange={(e) => setFormData({ ...formData, bpm: e.target.value })}
        />
      </div>
      <div className="form-group row">{analyzedOrRaw}</div>
      <div className="form-group">
        <div className="form-group">{editOrAnalyze}</div>
        <div className="form-group">
          <button
            onClick={returnToPieces}
            data-cy="back"
            className="col-sm-1 mr-2 my-2 btn btn-primary"
          >
            back
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
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
  setPiece,
  fetchPieces,
}

const EditPiece = withRouter(EditPieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(EditPiece)
