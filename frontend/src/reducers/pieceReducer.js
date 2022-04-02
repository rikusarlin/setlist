import analyzeService from '../services/analyze'
import piecesService from '../services/pieces'

export const fetchPiece = (pieceId, token) => {
  return async (dispatch) => {
    const fetchedPiece = await piecesService.getPiece(pieceId, token)
    await dispatch({
      type: 'GET_PIECE',
      data: fetchedPiece,
    })
  }
}

export const analyzeContents = (contents, token) => {
  return async (dispatch) => {
    const analyzedContents = await analyzeService.analyze(contents, token)
    //console.log(JSON.stringify(analyzedContents))
    dispatch({
      type: 'ANALYZE_PIECE',
      data: analyzedContents,
    })
  }
}

export const setPiece = (piece) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_PIECE',
      data: piece,
    })
  }
}

export const updatePiece = (piece, token) => {
  return async (dispatch) => {
    const updatedPiece = await piecesService.update(piece, token)
    //console.log(JSON.stringify(updatedPiece))
    dispatch({
      type: 'UPDATE_PIECE',
      data: updatedPiece,
    })
  }
}

export const transposeUp = (piece, token) => {
  return async (dispatch) => {
    const updatedPiece = await piecesService.transpose(piece, 'up', token)
    //console.log(JSON.stringify(updatedPiece))
    dispatch({
      type: 'TRANSPOSE_PIECE',
      data: updatedPiece,
    })
  }
}

export const transposeDown = (piece, token) => {
  return async (dispatch) => {
    const updatedPiece = await piecesService.transpose(piece, 'down', token)
    //console.log(JSON.stringify(updatedPiece))
    dispatch({
      type: 'TRANSPOSE_PIECE',
      data: updatedPiece,
    })
  }
}

export const addNote = (piece, noteInstrument, noteContents) => {
  return async (dispatch) => {
    console.log('addNote, piece before change: ' + JSON.stringify(piece))
    if (typeof piece.notes === 'undefined') {
      piece.notes = []
    }
    piece.notes.push({
      noteInstrument: noteInstrument,
      noteContents: noteContents,
    })
    console.log('addNote, piece after change: ' + JSON.stringify(piece))
    dispatch({
      type: 'ADD_NOTE',
      data: piece,
    })
  }
}

export const deleteNote = (piece, noteInstrument) => {
  return async (dispatch) => {
    const updatedPiece = {
      ...piece,
      notes: piece.notes.filter(
        (note) => note.noteInstrument !== noteInstrument
      ),
    }
    dispatch({
      type: 'DELETE_NOTE',
      data: updatedPiece,
    })
  }
}

export const updateNote = (piece, noteInstrument, noteContents) => {
  return async (dispatch) => {
    const updatedPiece = {
      ...piece,
      notes: piece.notes
        .filter((note) => note.noteInstrument !== noteInstrument)
        .push({
          noteInstrument: noteInstrument,
          noteContents: noteContents,
        }),
    }
    dispatch({
      type: 'UPDATE_NOTE',
      data: updatedPiece,
    })
  }
}

export const changeContents = (page, row, newContents) => {
  return async (dispatch) => {
    dispatch({
      type: 'CHANGE_CONTENTS',
      data: {
        page: page,
        row: row,
        contents: newContents,
      },
    })
  }
}

export const clearAnalysis = () => {
  return async (dispatch) => {
    dispatch({
      type: 'CLEAR_ANALYSIS',
      data: null,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in pieceReducer: ', state)
  console.log('action in pieceReducer', action)

  switch (action.type) {
    case 'GET_PIECE':
      return action.data
    case 'ANALYZE_PIECE':
      return action.data
    case 'SET_PIECE':
      return action.data
    case 'UPDATE_PIECE':
      return action.data
    case 'TRANSPOSE_PIECE':
      return action.data
    case 'CLEAR_ANALYSIS':
      return null
    case 'DELETE_NOTE':
      return action.data
    case 'ADD_NOTE':
      return action.data
    case 'UPDATE_NOTE':
      return action.data
    default:
      return state
  }
}

export default reducer
