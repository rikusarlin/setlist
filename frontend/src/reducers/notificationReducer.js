const initialState = {
  type: 'EMPTY',
  message: ''
}

export const showInfo = (message, timeoutSec) => {
  return async dispatch => {
    await dispatch(showNotification(message, 'INFO'))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeoutSec * 1000)
  }
}

export const showError = (message, timeoutSec) => {
  return async dispatch => {
    await dispatch(showNotification(message, 'ERROR'))
    setTimeout(() => {
      dispatch(hideNotification())
    }, timeoutSec * 1000)
  }
}

export const hideNotification = () => {
  return {
    type: 'HIDE',
    data: { }
  }
}

export const showNotification = (message, type) => {
  return {
    type: 'SHOW',
    data: {
      message: message,
      type: type
    }
  }
}

const notificationReducer = (state = initialState, action) => {
  console.log('state before action in notificationReducer: ', state)
  console.log('action in notificationReducer', action)

  switch(action.type) {
  case 'SHOW':
    state = action.data
    return state
  case 'HIDE':
    state = initialState
    return state
  default:
    return state
  }
}

export default notificationReducer