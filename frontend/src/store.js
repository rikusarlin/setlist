
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import piecesReducer from './reducers/piecesReducer'
import pieceReducer from './reducers/pieceReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import userReducer from './reducers/userReducer'

const reducer = combineReducers({
  pieces: piecesReducer,
  piece: pieceReducer,
  notification: notificationReducer,
  user: loginReducer,
  users: userReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
