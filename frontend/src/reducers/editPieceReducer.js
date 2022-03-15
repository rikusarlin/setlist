export const changePieceData = (piece) => {
  return async (dispatch) => {
    const pieceData = {
      title: piece.title,
      artist: piece.artist,
      bpm: piece.bpm,
      pages: piece.pages,
    }
    dispatch({
      type: 'CHANGE_PIECE_DATA',
      data: pieceData,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in editPieceReducer: ', state)
  console.log('action in editPieceReducer', action)

  switch (action.type) {
    case 'CHANGE_PIECE_DATA':
      return action.data
    default:
      return state
  }
}

export default reducer
