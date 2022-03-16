import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import piecesReducer from './reducers/piecesReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'
import pieceReducer from './reducers/pieceReducer'

const reducer = combineReducers({
  pieces: piecesReducer,
  notification: notificationReducer,
  user: loginReducer,
  users: userReducer,
  piece: pieceReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
