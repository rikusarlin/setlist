import React from 'react'
import { connect } from 'react-redux'

const Notification = (props) => {
  const notification = props.notification
  if(notification.message === null){
    return (
      <div/>
    )
  } else {
    if(notification.type === 'INFO'){
      return(
        <div className="info">
          {notification.message}
        </div>
      )
    } else if(notification.type === 'ERROR'){
      return(
        <div className="error">
          {notification.message}
        </div>
      )
    } else {
      return (
        <div>
          {notification.message}
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  console.log('Notification, current state: ',state)
  return {
    notification: state.notification
  }
}

export default connect(
  mapStateToProps,
  null
)(Notification)
