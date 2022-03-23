import setlistService from '../services/setlists'

export const fetchSetlists = (token) => {
  return async (dispatch) => {
    const setlists = await setlistService.getSetlists(token)
    await dispatch({
      type: 'GET_SETLISTS',
      data: setlists,
    })
  }
}

export const createSetlist = (name, token) => {
  return async (dispatch) => {
    const addedSetlist = await setlistService.createSetlist(name, token)
    dispatch({
      type: 'ADD_SETLIST',
      data: addedSetlist,
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

export const deleteSetlist = (setlistId, token) => {
  return async (dispatch) => {
    await setlistService.deleteSetlist(setlistId, token)
    const deleteData = {
      id: setlistId,
    }
    dispatch({
      type: 'DELETE_SETLIST',
      data: deleteData,
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
  console.log('state before action in setlistReducer: ', state)
  console.log('action in setlistReducer', action)

  switch (action.type) {
    case 'GET_SETLISTS':
      return action.data
    case 'ADD_SETLIST':
      return [...state, action.data]
    case 'MOVE_PIECE': {
      return [
        state.filter((setlist) => setlist.id !== action.data.id),
        action.data,
      ]
    }
    case 'DELETE_SETLIST': {
      return [state.filter((setlist) => setlist.id !== action.data.id)]
    }
    case 'ADD_PIECE_TO_SETLIST':
      return [
        state.filter((setlist) => setlist.id !== action.data.id),
        action.data,
      ]
    case 'DELETE_PIECE_FROM_SETLIST':
      return [
        state.filter((setlist) => setlist.id !== action.data.id),
        action.data,
      ]
    default:
      return state
  }
}

export default reducer
