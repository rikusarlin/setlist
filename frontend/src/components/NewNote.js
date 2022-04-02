import React from 'react'
import Togglable from './Togglable'
import { showInfo, showError } from '../reducers/notificationReducer'
import { addNote } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { removeReset } from '../utils'

export const NewNote = (props) => {
  const noteInstrument = useField('text')

  const noteFormRef = React.createRef()

  const handlePost = async (event) => {
    event.preventDefault()

    try {
      noteFormRef.current.toggleVisibility()
      await props.addNote(props.piece, noteInstrument.value, props.band.token)
      noteInstrument.reset()
      props.showInfo('added new note to piece', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in adding new note to piece', 3)
    }
  }

  return (
    <Togglable buttonLabel="new instrument notes" ref={noteFormRef}>
      <div>
        <h3>New note</h3>
        <form onSubmit={handlePost}>
          <div className="form-group row">
            <label htmlFor="noteInstrument" className="col-sm-6 col-form-label">
              Note instrument
            </label>
            <input
              className="col-sm-6"
              data-cy="noteInstrument"
              id="noteInstrument"
              {...removeReset(noteInstrument)}
            />
          </div>
          <button
            type="submit"
            data-cy="create"
            className="btn btn-primary my-2"
          >
            create
          </button>
        </form>
      </div>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    piece: state.piece,
  }
}

const mapDispatchToProps = {
  addNote,
  showInfo,
  showError,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewNote)
