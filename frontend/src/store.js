import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import piecesReducer from './reducers/piecesReducer'
import notificationReducer from './reducers/notificationReducer'
import loginReducer from './reducers/loginReducer'
import bandReducer from './reducers/bandReducer'
import pieceReducer from './reducers/pieceReducer'
import setlistReducer from './reducers/setlistReducer'

const reducer = combineReducers({
  pieces: piecesReducer,
  notification: notificationReducer,
  band: loginReducer,
  bands: bandReducer,
  piece: pieceReducer,
  setlists: setlistReducer,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
