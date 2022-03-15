import React from 'react'
import './App.css'
import Pieces from './components/Pieces'
import Piece from './components/Piece'
import Users from './components/Users'
import User from './components/User'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import EditPiece from './components/EditPiece'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from './reducers/loginReducer'
import { showInfo, showError } from './reducers/notificationReducer'
import { emptyPieceList } from './reducers/piecesReducer'

export const App = (props) => {
  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      props.logout()
      props.emptyPieceList()
      props.showInfo('logout successful', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in logout', 3)
    }
  }

  const logoutForm = () => (
    <button
      type="button"
      onClick={handleLogout}
      className="btn btn-primary mr-2 my-2 my-sm-0"
    >
      logout
    </button>
  )

  const userById = (id) => {
    if (props.user !== null) {
      return props.users.find((a) => a.id === id)
    } else {
      return null
    }
  }

  return (
    <div className="container">
      <Router>
        {props.user.username !== null ? (
          <div>
            <div>
              <div className="navbar navbar-expand-lg">
                <div className="navbar-nav navbar-light bg-light">
                  <div className="nav-item">
                    <Link className="nav-link" to="/">
                      pieces
                    </Link>
                  </div>
                  <div className="nav-item">
                    <Link className="nav-link" to="/users">
                      users
                    </Link>
                  </div>
                  <div className="nav-item">{logoutForm()}</div>
                </div>
              </div>
              <Notification />
              <Route
                exact
                path="/"
                render={() => (
                  <div>
                    <Pieces />
                  </div>
                )}
              />
              <Route
                exact
                path="/newpiece"
                render={() => (
                  <div>
                    <EditPiece />
                  </div>
                )}
              />
              <Route
                exact
                path="/editpiece/:id"
                render={({ match }) => <EditPiece pieceId={match.params.id} />}
              />
              <Route
                exact
                path="/pieces"
                render={() => (
                  <div>
                    <Pieces />
                  </div>
                )}
              />
              <Route exact path="/users" render={() => <Users />} />
              <Route
                exact
                path="/users/:id"
                render={({ match }) => (
                  <User user={userById(match.params.id)} />
                )}
              />
              <Route
                exact
                path="/piece/:id"
                render={({ match }) => <Piece pieceId={match.params.id} />}
              />
            </div>
          </div>
        ) : (
          <div>
            <Notification />
            <LoginForm />
          </div>
        )}
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    users: state.users,
    pieces: state.pieces,
  }
}

const mapDispatchToProps = {
  logout,
  showInfo,
  showError,
  emptyPieceList,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
