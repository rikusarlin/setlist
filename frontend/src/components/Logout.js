import React from 'react'
import { connect } from 'react-redux'
import { logout } from '../reducers/loginReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { emptyPieceList } from '../reducers/piecesReducer'
import { emptySetlist } from '../reducers/setlistReducer'
import { withRouter } from 'react-router-dom'

export const LogoutNoHistory = (props) => {
  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      await props.logout()
      await props.emptyPieceList()
      await props.emptySetlist()
      props.showInfo('logout successful', 3)
      props.history.push('/')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in logout', 3)
    }
  }
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="btn btn-primary mr-2 my-2 my-sm-0"
    >
      logout
    </button>
  )
}

const mapDispatchToProps = {
  logout,
  showInfo,
  showError,
  emptyPieceList,
  emptySetlist,
}

const Logout = withRouter(LogoutNoHistory)

export default connect(null, mapDispatchToProps)(Logout)
