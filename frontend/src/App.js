import React from 'react'
import './App.css'
import Pieces from './components/Pieces'
import Piece from './components/Piece'
import Setlists from './components/Setlists'
import Setlist from './components/Setlist'
import SetlistPiece from './components/SetlistPiece'
import LoginForm from './components/LoginForm'
import SignUpForm from './components/SignUpForm'
import Notification from './components/Notification'
import EditPiece from './components/EditPiece'
import NewPiece from './components/NewPiece'
import NewSetlist from './components/NewSetlist'
import Logout from './components/Logout'
import ResetPasswordForm from './components/ResetPasswordForm'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'

export const App = (props) => {
  const setlistById = (id) => {
    if (props.setlists !== null) {
      return props.setlists.find((a) => a.id === id)
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
                  <Link className="nav-link" to="/setlists">
                    setlists
                  </Link>
                </div>
                <div className="nav-item ">
                  <Logout />
                </div>
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
            <Route
              exact
              path="/setlists"
              render={() => (
                <div>
                  <NewSetlist />
                  <Setlists />
                </div>
              )}
            />
            <Route
              exact
              path="/setlist/:id"
              render={({ match }) => (
                <Setlist setlistId={setlistById(match.params.id).id} />
              )}
            />
            <Route
              exact
              path="/setlistpiece/:setlistid/:pieceid"
              render={({ match }) => (
                <SetlistPiece
                  setlistId={setlistById(match.params.setlistid).id}
                  pieceId={match.params.pieceid}
                />
              )}
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
    setlists: state.setlists,
  }
}

export default connect(mapStateToProps, null)(App)
