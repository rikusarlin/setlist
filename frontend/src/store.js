import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import piecesReducer from './reducers/piecesReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import bandReducer from './reducers/bandReducer'
import pieceReducer from './reducers/pieceReducer'

const reducer = combineReducers({
  pieces: piecesReducer,
  notification: notificationReducer,
  band: loginReducer,
  bands: bandReducer,
  piece: pieceReducer,
})

const store = createStore(reducer, applyMiddleware(thunk))

export default store
