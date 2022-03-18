import React, { useState } from 'react'
import { connect } from 'react-redux'
import { login, signUpBand } from '../reducers/loginReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { withRouter } from 'react-router-dom'

export const LoginFormNoHistory = (props) => {
  const [formData] = useState({
    username: '',
    name: '',
    password: '',
    securityQuestion: '',
    securityAnswer: '',
  })

  const handleSignIn = async (event) => {
    event.preventDefault()
    try {
      props.signUpBand(formData)
      props.showInfo('sign up successful', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in sign up', 3)
    }
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleSignIn}>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-1 col-form-label">
            Username
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="username"
              name="username"
              id="username"
              value={formData.username}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-1 col-form-label">
            Name
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="name"
              name="name"
              id="name"
              value={formData.name}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Password" className="col-sm-1 col-form-label">
            Password
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="password"
              name="password"
              id="password"
              value={formData.password}
            />
          </div>
        </div>
        <div className="form-group row">
          <label
            htmlFor="Security question"
            className="col-sm-1 col-form-label"
          >
            Security question
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="securityQuestion"
              name="securityQuestion"
              id="securityQuestion"
              value={formData.securityQuestion}
            />
          </div>
        </div>
        <div className="form-group row">
          <label
            htmlFor="Security question answer"
            className="col-sm-1 col-form-label"
          >
            Security question answer
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="securityAnswer"
              name="securityAnswer"
              id="securityAnser"
              value={formData.securityQuestion}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" data-cy="signUp">
          sign up
        </button>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  login,
  showInfo,
  showError,
  signUpBand,
}

const LoginForm = withRouter(LoginFormNoHistory)

export default connect(null, mapDispatchToProps)(LoginForm)
