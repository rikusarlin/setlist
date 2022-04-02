import React from 'react'
import { connect } from 'react-redux'

export const NoteSelectionList = (props) => {
  if (
    props.piece !== null &&
    typeof props.piece !== 'undefined' &&
    typeof props.piece.notes !== 'undefined' &&
    props.piece.notes.length > 0
  ) {
    var noteList = [
      {
        id: 'choose',
        instrument: '(Instrument)',
      },
    ]
    noteList = noteList.concat(
      props.piece.notes.map((note) => {
        return {
          id: note.instrument,
          instrument: note.instrument,
        }
      })
    )
    const noteListOptions = noteList.map((note, index) => {
      return (
        <option key={index} value={note.id}>
          {note.instrument}
        </option>
      )
    })
    return (
      <select
        value={props.selectedNote}
        data-cy="cy_id_notelist"
        name="setlist"
        onChange={props.onChange}
        className={props.className}
      >
        {noteListOptions}
      </select>
    )
  } else {
    return <div />
  }
}

const mapStateToProps = (state) => {
  return {
    piece: state.piece,
  }
}

export default connect(mapStateToProps, null)(NoteSelectionList)
