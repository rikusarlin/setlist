import React from 'react'
import './App.css'
import Pieces from './components/Pieces'
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
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'

export const App = (props) => {
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
                  <Link className="nav-link" to="setlists">
                    setlists
                  </Link>
                </div>
                <div className="nav-item ">
                  <Logout />
                </div>
              </div>
            </div>
            <Notification />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Pieces />
                  </div>
                }
              />
              <Route
                path="newpiece"
                element={
                  <div>
                    <NewPiece />
                  </div>
                }
              />
              <Route
                path="pieces"
                element={
                  <div>
                    <Pieces />
                  </div>
                }
              />
              <Route
                path="setlists"
                element={
                  <div>
                    <NewSetlist />
                    <Setlists />
                  </div>
                }
              />
              <Route path="setlist/:setlistId" element={<Setlist />} />
              <Route
                path="setlistpiece/:setlistId/:pieceId"
                element={<SetlistPiece />}
              />
              <Route path="piece/:pieceId" element={<EditPiece />} />
            </Routes>
          </div>
        ) : (
          <div>
            <Notification />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <LoginForm />
                  </div>
                }
              />
              <Route
                path="pieces"
                element={
                  <div>
                    <LoginForm />
                  </div>
                }
              />
              <Route
                path="signup"
                element={
                  <div>
                    <SignUpForm />
                  </div>
                }
              />
              <Route
                path="reset-password"
                element={
                  <div>
                    <ResetPasswordForm />
                  </div>
                }
              />
            </Routes>
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
