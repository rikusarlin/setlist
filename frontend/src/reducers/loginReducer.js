import loginService from '../services/login'
import bandService from '../services/bands'
import resetService from '../services/reset'

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

export const resetPassword = (resetInfo) => {
  return async (dispatch) => {
    await resetService.reset(resetInfo)
    const band = await loginService.login({
      username: resetInfo.username,
      password: resetInfo.newPassword,
    })
    dispatch({
      type: 'RESET_PASSWORD',
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
  //console.log('state before action in loginReducer: ', state)
  //console.log('action in login Reducer', action)

  switch (action.type) {
    case 'LOGIN':
      return action.data
    case 'SIGNUP':
      return action.data
    case 'RESET_PASSWORD':
      return action.data
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

export default reducer
/*
import loginService from '../services/login'
import bandService from '../services/bands'
import resetService from '../services/reset'
import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit'

export const login = createAction('login/login')
export const logout = createAction('login/logut')
export const signUpBand = createAction('login/signup')
export const resetPassword = createAction('login/reset')

const initialState = {
  username: null,
  name: null,
  token: null,
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
}

const loginThunk = createAsyncThunk(
  'login/login',
  async (username, password) => {
    return await loginService.login({
      username: username,
      password: password,
    })
  }
)

const signUpThunk = createAsyncThunk('login/signup', async (bandData) => {
  await bandService.signUp(bandData)
  return await loginService.login({
    username: bandData.username,
    password: bandData.password,
  })
})

const resetPasswordThunk = createAsyncThunk(
  'login/reset',
  async (resetInfo) => {
    await resetService.reset(resetInfo)
    return await loginService.login({
      username: resetInfo.username,
      password: resetInfo.newPassword,
    })
  }
)

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    logout: {
      reducer: (state) => {
        state.username = null
        state.name = null
        state.token = null
      },
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state, action) => {
        console.log('loginThunk.pending')
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.error = null
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log('loginThunk.fulfilled')
        if (state.loading === 'pending') {
          state.loading = 'idle'
          state.username = action.payload.username
          state.name = action.payload.name
          state.token = action.payload.token
          state.currentRequestId = undefined
          state.error = null
        }
      })
      .addCase(loginThunk.rejected, (state, action) => {
        console.log('loginThunk.rejected')
        if (state.loading === 'pending') {
          state.loading = 'idle'
          state.error = action.error
          state.currentRequestId = undefined
        }
      })
      .addCase(signUpThunk.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle'
          state.username = action.payload.username
          state.name = action.payload.name
          state.token = action.payload.token
          state.currentRequestId = undefined
        }
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle'
          state.error = action.error
          state.currentRequestId = undefined
        }
      })
      .addCase(resetPasswordThunk.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle'
          state.username = action.payload.username
          state.name = action.payload.name
          state.token = action.payload.token
          state.currentRequestId = undefined
        }
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        if (state.loading === 'pending') {
          state.loading = 'idle'
          state.error = action.error
          state.currentRequestId = undefined
        }
      })
  },
})

export default loginSlice.reducer
*/
