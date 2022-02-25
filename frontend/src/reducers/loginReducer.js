import loginService from '../services/login'

const initialState = {
  username: null,
  name: null,
  token: null
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login(
      { username: username,
        password: password })
    dispatch({
      type: 'LOGIN',
      data: {
        username: user.username,
        name: user.name,
        token: user.token
      }
    })
  }
}

export const logout = () => {
  return async dispatch => {
    dispatch({
      type: 'LOGOUT',
      data: initialState
    })
  }
}

const reducer = (state = initialState, action) => {
  console.log('state before action in loginReducer: ', state)
  console.log('action in login Reducer', action)

  switch(action.type) {
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return initialState
  default:
    return state
  }
}

export default reducer