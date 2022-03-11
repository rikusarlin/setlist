import pieceService from '../services/pieces'

export const deletePiece = (pieceId, token) => {
  return async (dispatch) => {
    const response = await pieceService.deletePiece(pieceId, token)
    console.log(`In deletePiece (id ${pieceId}), response: ${response}`)
    dispatch({
      type: 'DELETE_PIECE',
      data: pieceId,
    })
  }
}

export const createPiece = (content, token) => {
  return async (dispatch) => {
    const newPiece = await pieceService.create(content, token)
    dispatch({
      type: 'NEW_PIECE',
      data: newPiece,
    })
  }
}

export const fetchPieces = (token) => {
  console.log('In piecesReducer.fetchPieces, token: ', token)
  return async (dispatch) => {
    const pieces = await pieceService.getAll(token)
    console.log('Pieces.length: ', pieces.length)
    dispatch({
      type: 'FETCH_PIECES',
      data: pieces,
    })
  }
}

export const emptyPieceList = () => {
  return async (dispatch) => {
    dispatch({
      type: 'EMPTY_PIECE_LIST',
      data: null,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in piecesReducer: ', state)
  console.log('action in piecesReducer', action)

  switch (action.type) {
    case 'NEW_PIECE':
      return [...state, action.data]
    case 'DELETE_PIECE':
      return state.filter((piece) => piece.id !== action.data)
    case 'FETCH_PIECES':
      return action.data
    case 'EMPTY_PIECE_LIST':
      return null
    default:
      return state
  }
}

export default reducer
