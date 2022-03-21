import pieces from '../services/pieces'
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

export const addSetlist = (name, token) => {
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

export const movePieceUp = (setlistId, pieceId) => {
  return async (dispatch) => {
    dispatch({
      type: 'MOVE_PIECE_UP',
      data: {
        setlistId: setlistId,
        pieceId: pieceId,
      },
    })
  }
}

export const movePieceDown = (setlistId, pieceId) => {
  return async (dispatch) => {
    dispatch({
      type: 'MOVE_PIECE_DOWN',
      data: {
        setlistId: setlistId,
        pieceId: pieceId,
      },
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in setlistReducer: ', state)
  console.log('action in setlistReducer', action)

  const setlistById = (id) => {
    if (state !== null) {
      return state.find((a) => a.id === id)
    } else {
      return null
    }
  }

  const pieceById = (setlist, pieceId) => {
    if (setlist !== null) {
      return pieces.find((a) => a.id === pieceId)
    } else {
      return null
    }
  }

  const arraymove = (arr, fromIndex, toIndex) => {
    var element = arr[fromIndex]
    arr.splice(fromIndex, 1)
    arr.splice(toIndex, 0, element)
  }

  switch (action.type) {
    case 'GET_SETLISTS':
      return action.data
    case 'ADD_SETLIST':
      return [...state, action.data]
    case 'MOVE_PIECE_UP': {
      var setlist = setlistById(action.data.setlistId)
      const pieceIndex = pieceById(setlist, action.data.pieceId)
      setlist.pieces = arraymove(setlist, pieceIndex, pieceIndex - 1)
      return [
        state.filter((setlist) => setlist.id !== action.data.setlistId),
        setlist,
      ]
    }
    case 'MOVE_PIECE_DOWN': {
      setlist = setlistById(action.data.setlistId)
      const pieceIndex = pieceById(setlist, action.data.pieceId)
      setlist.pieces = arraymove(setlist, pieceIndex, pieceIndex + 1)
      return [
        state.filter((setlist) => setlist.id !== action.data.setlistId),
        setlist,
      ]
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
