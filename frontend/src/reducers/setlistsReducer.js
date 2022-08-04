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

export const emptySetlist = () => {
  return async (dispatch) => {
    dispatch({
      type: 'EMPTY_SETLISTS',
      data: null,
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

const reducer = (state = [], action) => {
  console.log('state before action in setlistReducer: ', state)
  console.log('action in setlistReducer', action)

  switch (action.type) {
    case 'EMPTY_SETLISTS':
      return null
    case 'GET_SETLISTS':
      return action.data
    case 'ADD_SETLIST':
      return [...state, action.data]
    case 'DELETE_SETLIST': {
      const newState = [
        state.filter((setlist) => setlist.id !== action.data.id),
      ]
      return newState
    }
    default:
      return state
  }
}

export default reducer
