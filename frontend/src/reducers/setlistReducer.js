import setlistService from '../services/setlists'

export const getSetlist = (id, token) => {
  return async (dispatch) => {
    const fetchedSetlist = await setlistService.getSetlist(id, token)
    dispatch({
      type: 'GET_SETLIST',
      data: fetchedSetlist,
    })
  }
}

export const addPieceToSetlist = (setlistId, pieceId, token) => {
  return async (dispatch) => {
    const updatedSetlist = await setlistService.addPieceToSetlist(
      setlistId,
      pieceId,
      token
    )
    dispatch({
      type: 'ADD_PIECE_TO_SETLIST',
      data: updatedSetlist,
    })
  }
}

export const deletePieceFromSetlist = (setlistId, pieceId, token) => {
  return async (dispatch) => {
    const updatedSetlist = await setlistService.deletePieceFromSetlist(
      setlistId,
      pieceId,
      token
    )
    dispatch({
      type: 'DELETE_PIECE_FROM_SETLIST',
      data: updatedSetlist,
    })
  }
}

export const movePiece = (setlistId, pieceId, direction, token) => {
  return async (dispatch) => {
    const updatedSetlist = await setlistService.movePieceInSetlist(
      setlistId,
      pieceId,
      direction,
      token
    )
    dispatch({
      type: 'MOVE_PIECE',
      data: updatedSetlist,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in setlistsReducer: ', state)
  console.log('action in setlistReducer', action)

  switch (action.type) {
    case 'GET_SETLIST': {
      return action.data
    }
    case 'MOVE_PIECE': {
      return action.data
    }
    case 'ADD_PIECE_TO_SETLIST': {
      return action.data
    }
    case 'DELETE_PIECE_FROM_SETLIST':
      return action.data
    default:
      return state
  }
}

export default reducer
