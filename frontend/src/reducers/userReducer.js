import userService from '../services/users'

export const fetchUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch({
      type: 'FETCH_USERS',
      data: users,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in userReducer: ', state)
  console.log('action in userReducer', action)

  switch(action.type) {
  case 'FETCH_USERS':
    return action.data
  default:
    return state
  }
}

export default reducer