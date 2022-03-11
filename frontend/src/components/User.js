import React from 'react'
import { withRouter } from 'react-router-dom'

const UserNoHistory = (props) => {
  if (props.user === undefined) {
    props.history.push('/pieces')
    return <div />
  }
  return (
    <div>
      <h2>{props.user.name}</h2>
    </div>
  )
}

const User = withRouter(UserNoHistory)

export default User
