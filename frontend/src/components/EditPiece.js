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
import NewNote from './NewNote'
import { Link, Element } from 'react-scroll'

export const EditPieceNoHistory = (props) => {
  const [selectedNote, setSelectedNote] = useState('choose')
  const [previousPiece, setPreviousPiece] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    duration: 0,
    delay: 0,
    contents: '',
    noteContents: '',
    noteInstrument: '',
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
        duration: props.piece.duration,
        delay: props.piece.delay,
        contents: getRowContents(),
        noteContents:
          typeof props.piece.notes !== 'undefined' &&
          props.piece.notes.length > 0
            ? getNoteContents(props.piece.notes[0].noteInstrument)
            : '',
        noteInstrument:
          typeof props.piece.notes !== 'undefined' &&
          props.piece.notes.length > 0
            ? props.piece.notes[0].noteInstrument
            : '',
      }
      setFormData(startFormData)
    }
  }, [props.piece])

  const updateContents = async () => {
    try {
      let newPiece = props.piece
      newPiece.title = formData.title
      newPiece.artist = formData.artist
      newPiece.duration = formData.duration
      newPiece.delay = formData.delay

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
      duration: formData.duration,
      delay: formData.delay,
      pages: [page],
      contents: formData.contents,
      noteContents: formData.noteContents,
      noteInstrument: formData.noteInstrument,
      skipWhitespace: false,
    }
    try {
      await props.analyzeContents(newPiece, props.band.token)
      await props.deletePiece(previousPiece.id, props.band.token)
      await props.fetchPieces(props.band.token)
      props.showInfo('piece saved', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in saving piece', 3)
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

  const getNoteContents = (instrumentName) => {
    let noteContents = []
    if (props.piece.notes !== null && props.piece.notes !== undefined) {
      noteContents = props.piece.notes
        .filter((note) => note.noteInstrument === instrumentName)
        .map((note) => note.rows.map((row) => row.contents).join('\n'))
    }
    return noteContents
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

  var noteList = [
    {
      id: 'choose',
      noteInstrument: '(Choose)',
    },
  ]
  if (
    props.piece !== null &&
    typeof props.piece !== 'undefined' &&
    typeof props.piece.notes !== 'undefined' &&
    props.piece.notes.length >= 0
  ) {
    noteList = noteList.concat(
      props.piece.notes.map((note) => {
        note.id, note.noteInstrument
      })
    )
  }
  const noteListOptions = noteList.map((note, index) => (
    <option key={index} value={note.id}>
      {note.noteInstrument}
    </option>
  ))

  const noteListSelection =
    typeof props.piece !== 'undefined' &&
    typeof props.piece.notes !== 'undefined' &&
    props.piece.notes.length > 0 ? (
      <select
        value={selectedNote.value}
        data-cy="cy_id_notelist"
        name="setlist"
        onChange={(e) => {
          setSelectedNote(e.target.value)
          setFormData({
            ...formData,
            noteContents: getNoteContents(e.target.value),
          })
        }}
      >
        {noteListOptions}
      </select>
    ) : (
      ''
    )

  const topButtons =
    props.piece !== null ? (
      <div>
        <div className="row">
          <Link
            className="col-sm-2 mr-2 py-1 btn btn-primary white-color"
            activeClass="active"
            to="bottomOfPage"
            smooth={true}
            delay={props.piece.delay * 1000}
            duration={props.piece.duration * 0.7 * 1000}
          >
            play
          </Link>{' '}
          <button
            onClick={updateContents}
            data-cy="update"
            className="col-sm-1 mr-2 btn btn-primary"
          >
            save
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
            up
          </button>
          <button
            onClick={transposeDown}
            data-cy="transposeDown"
            className="col-sm-2 mr-2 btn btn-primary"
          >
            down
          </button>
          {noteListSelection}
          <button
            onClick={confirmDelete}
            data-cy="deletePiece"
            className="col-sm-2 mr-2 btn btn-danger"
          >
            delete
          </button>
        </div>
        <div className="row">
          <NewNote />
        </div>
      </div>
    ) : (
      <div>
        <button
          onClick={analyzeContents}
          data-cy="save"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          save
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

  const editOrAnalyze =
    props.piece !== null ? (
      <div>
        <Link
          className="col-sm-2 mr-2 py-1 btn btn-primary white-color"
          activeClass="active"
          to="topOfPage"
          smooth={true}
        >
          top
        </Link>
        <button
          onClick={updateContents}
          data-cy="update"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          save
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
          up
        </button>
        <button
          onClick={transposeDown}
          data-cy="transposeDown"
          className="col-sm-2 mr-2 btn btn-primary"
        >
          down
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
          data-cy="save"
          className="col-sm-1 mr-2 btn btn-primary"
        >
          save
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

  const editFields =
    selectedNote !== 'choose' ? (
      <div className="row">
        <textarea
          className="col-sm-12"
          rows="20"
          name="contents"
          id="conenents"
          data-cy="contents"
          value={formData.contents}
          onChange={(e) => {
            setFormData({ ...formData, contents: e.target.value })
          }}
        />
      </div>
    ) : (
      <div className="row">
        <textarea
          className="col-sm-6"
          rows="20"
          name="contents"
          id="conenents"
          data-cy="contents"
          value={formData.contents}
          onChange={(e) =>
            setFormData({ ...formData, contents: e.target.value })
          }
        />
        <textarea
          className="col-sm-6"
          rows="20"
          name="noteContents"
          id="noteConenents"
          data-cy="noteContents"
          value={formData.noteContents}
          onChange={(e) =>
            setFormData({ ...formData, contents: e.target.value })
          }
        />
      </div>
    )

  const analyzedOrRaw =
    props.piece !== null ? <PieceRows piece={props.piece} /> : { editFields }

  return (
    <div className="container">
      <Element name="topOfPage" />
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
        <label htmlFor="Duration" className="col-sm-2 col-form-label">
          Length (seconds)
        </label>
        <input
          className="col-sm-5"
          name="duration"
          id="duration"
          data-cy="duration"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
        />
      </div>
      <div className="form-group row">
        <label htmlFor="Delay" className="col-sm-2 col-form-label">
          Delay (seconds)
        </label>
        <input
          className="col-sm-5"
          name="delay"
          id="delay"
          data-cy="delay"
          value={formData.delay}
          onChange={(e) => setFormData({ ...formData, delay: e.target.value })}
        />
      </div>
      <div className="form-group">{topButtons}</div>
      <div className="form-group row">{analyzedOrRaw}</div>
      <div className="form-group">
        <div className="form-group">{editOrAnalyze}</div>
        <Element name="bottomOfPage" />{' '}
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
