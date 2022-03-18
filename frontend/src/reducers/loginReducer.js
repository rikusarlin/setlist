import loginService from '../services/login'
import bandService from '../services/bands'

const initialState = {
  username: null,
  name: null,
  token: null,
}

export const login = (username, password) => {
  return async (dispatch) => {
    const band = await loginService.login({
      username: username,
      password: password,
    })
    dispatch({
      type: 'LOGIN',
      data: {
        username: band.username,
        name: band.name,
        token: band.token,
      },
    })
  }
}

export const signUpBand = (bandData) => {
  return async (dispatch) => {
    await bandService.signUp(bandData)
    const band = await loginService.login({
      username: bandData.username,
      password: bandData.password,
    })
    dispatch({
      type: 'SIGNUP',
      data: {
        username: band.username,
        name: band.name,
        token: band.token,
      },
    })
  }
}

export const logout = () => {
  return async (dispatch) => {
    dispatch({
      type: 'LOGOUT',
      data: initialState,
    })
  }
}

const reducer = (state = initialState, action) => {
  console.log('state before action in loginReducer: ', state)
  console.log('action in login Reducer', action)

  switch (action.type) {
    case 'LOGIN':
      return action.data
    case 'SIGNUP':
      return action.data
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

export default reducer
