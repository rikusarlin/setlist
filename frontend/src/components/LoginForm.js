import React from 'react'
import { connect } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { useField } from '../hooks'
import { removeReset } from '../utils'
import { withRouter } from '../utils'

export const LoginFormNoHistory = (props) => {
  const userName = useField('text')
  const passWord = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const username = userName.value
      const password = passWord.value
      await props.login(username, password)
      userName.reset()
      passWord.reset()
      props.showInfo('login successful', 3)
      // Always begin with a known address
      props.router.navigate('/pieces')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('wrong username or password', 3)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleLogin}>
        <div className="form-group row">
          <h3 className="col-sm-2 px-0">Setlist login</h3>
        </div>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-1 col-form-label px-0">
            Username
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="username"
              {...removeReset(userName)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Password" className="col-sm-1 col-form-label px-0">
            Password
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="password"
              {...removeReset(passWord)}
            />
          </div>
        </div>
        <div className="form-group row">
          <button
            type="submit"
            className="col-sm-2 btn btn-primary mx-1"
            data-cy="login"
          >
            login
          </button>
        </div>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  login,
  showInfo,
  showError,
}

const LoginForm = withRouter(LoginFormNoHistory)

export default connect(null, mapDispatchToProps)(LoginForm)
