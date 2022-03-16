import bandService from '../services/bands'

export const fetchBands = () => {
  return async (dispatch) => {
    const users = await bandService.getAll()
    dispatch({
      type: 'FETCH_BANDS',
      data: users,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in bandReducer: ', state)
  console.log('action in bandReducer', action)

  switch (action.type) {
    case 'FETCH_BANDS':
      return action.data
    default:
      return state
  }
}

export default reducer
