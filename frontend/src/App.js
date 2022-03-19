import React from 'react'
import './App.css'
import Pieces from './components/Pieces'
import Piece from './components/Piece'
import Bands from './components/Bands'
import Band from './components/Band'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Notification from './components/Notification'
import EditPiece from './components/EditPiece'
import NewPiece from './components/NewPiece'
import ResetPasswordForm from './components/ResetPasswordForm'
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

  const bandById = (id) => {
    if (props.band !== null) {
      return props.bands.find((a) => a.id === id)
    } else {
      return null
    }
  }

  return (
    <div className="container">
      <Router>
        {props.band.username !== null ? (
          <div>
            <div>
              <div className="nav nav-tabs">
                <div className="nav-item">
                  <Link className="nav-link" to="/">
                    pieces
                  </Link>
                </div>
                <div className="nav-item">
                  <Link className="nav-link" to="/bands">
                    bands
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
                  <NewPiece />
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
            <Route exact path="/bands" render={() => <Bands />} />
            <Route
              exact
              path="/bands/:id"
              render={({ match }) => <Band band={bandById(match.params.id)} />}
            />
            <Route
              exact
              path="/piece/:id"
              render={({ match }) => <Piece pieceId={match.params.id} />}
            />
          </div>
        ) : (
          <div>
            <Notification />
            <Route
              exact
              path="/"
              render={() => (
                <div>
                  <LoginForm />
                </div>
              )}
            />
            <Route
              exact
              path="/pieces"
              render={() => (
                <div>
                  <LoginForm />
                </div>
              )}
            />
            <Route
              exact
              path="/signup"
              render={() => (
                <div>
                  <SignUpForm />
                </div>
              )}
            />
            <Route
              exact
              path="/reset-password"
              render={() => (
                <div>
                  <ResetPasswordForm />
                </div>
              )}
            />
          </div>
        )}
      </Router>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    bands: state.bands,
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
