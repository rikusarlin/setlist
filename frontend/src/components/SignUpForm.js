import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { signUpBand } from '../reducers/loginReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import { removeReset } from '../utils'

export const SignUpFormNoHistory = (props) => {
  const username = useField('text')
  const bandName = useField('text')
  const bandPassword = useField('password')
  const securityQuestion = useField('text')
  const securityAnswer = useField('text')
  useEffect(() => {
    username.reset
    bandName.reset
    bandPassword.reset
    securityQuestion.reset
    securityAnswer.reset
  }, [])

  const handleSignUp = async (event) => {
    event.preventDefault()
    try {
      const formData = {
        username: username.value,
        name: bandName.value,
        password: bandPassword.value,
        securityQuestion: securityQuestion.value,
        securityAnswer: securityAnswer.value,
      }
      props.signUpBand(formData)
      props.showInfo('sign up successful', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in sign up', 3)
    }
  }
  const handleCancel = async (event) => {
    event.preventDefault()
    props.history.push('/')
  }

  return (
    <div className="container">
      <form onSubmit={handleSignUp}>
        <div className="form-group row">
          <h3 className="col-sm-5 px-0">Sign up to Setlist</h3>
        </div>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-2 col-form-label px-0">
            Username
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="username"
              autoComplete="new-password"
              {...removeReset(username)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Username" className="col-sm-2 col-form-label px-0">
            Band name
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="name"
              autoComplete="new-password"
              {...removeReset(bandName)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Password" className="col-sm-2 col-form-label px-0">
            Password
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="password"
              autoComplete="new-password"
              {...removeReset(bandPassword)}
            />
          </div>
        </div>
        <div className="form-group row">
          <label
            htmlFor="Security question"
            className="col-sm-2 col-form-label px-0"
          >
            Security question
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="securityQuestion"
              autoComplete="new-password"
              {...removeReset(securityQuestion)}
            />
          </div>
          <div className="col-sm-5">
            Security question and answer are used to reset password
          </div>
        </div>
        <div className="form-group row">
          <label
            htmlFor="Security question answer"
            className="col-sm-2 col-form-label px-0"
          >
            Security question answer
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="securityAnswer"
              autoComplete="new-password"
              {...removeReset(securityAnswer)}
            />
          </div>
        </div>
        <div className="form-group row">
          <button
            type="submit"
            className="col-sm-2 btn btn-primary mx-1"
            data-cy="signup"
          >
            sign up
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="col-sm-2 btn btn-primary mx-1"
            data-cy="cancel"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  showInfo,
  showError,
  signUpBand,
}

const SignUpForm = withRouter(SignUpFormNoHistory)

export default connect(null, mapDispatchToProps)(SignUpForm)
