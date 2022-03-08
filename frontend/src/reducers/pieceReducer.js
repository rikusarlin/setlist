import pieceService from '../services/pieces'

export const fetchPiece = (pieceId, token) => {
  return async dispatch => {
    const fetchedPiece = await pieceService.getPiece(pieceId, token)
    //console.log(`In getPiece (id ${pieceId}), response: ${JSON.stringify(fetchedPiece)}`)
    dispatch({
      type: 'GET_PIECE',
      data: fetchedPiece
    })
  }
}

export const emptyPiece = () => {
  return async dispatch => {
    dispatch({
      type: 'EMPTY_PIECE',
      data: null,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in pieceReducer: ', state)
  console.log('action in pieceReducer', action)

  switch(action.type) {
  case 'GET_PIECE':
    return action.data
  // We catch a signal from another reducer and update this state, too... Not sure if this is a good idea...
  case 'TRANSPOSE_PIECE':
    return action.data
  case 'EMPTY_PIECE':
    return null
  default:
    return state
  }
}

export default reducer