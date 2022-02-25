import React from 'react'
import { connect } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import  { useField } from '../hooks'
import { removeReset } from '../utils'
import { withRouter } from 'react-router-dom'

export const LoginFormNoHistory = (props) => {
  const userName = useField('text')
  const passWord = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const username = userName.value
      const password = passWord.value
      props.login(username, password)
      userName.reset()
      passWord.reset()
      props.showInfo('login successful', 3)
      // Always begin with a known address
      props.history.push('/blogs')
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('wrong username or password',3)
    }
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-1 col-form-label">Username</label>
          <div className="col-sm-3">
            <input className="form-control" data-cy="username" {...removeReset(userName)} />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Password" className="col-sm-1 col-form-label">Password</label>
          <div className="col-sm-3">
            <input className="form-control" data-cy="password" {...removeReset(passWord)} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" data-cy="login">login</button>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  login, showInfo, showError
}

const LoginForm = withRouter(LoginFormNoHistory)

export default connect(
  null,
  mapDispatchToProps
)(LoginForm)
