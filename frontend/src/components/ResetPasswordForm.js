import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { resetPassword } from '../reducers/loginReducer'
import { fetchBands } from '../reducers/bandReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import { removeReset } from '../utils'

export const ResetPasswordNoHistory = (props) => {
  const [securityQuestion, setSecurityQuestion] = useState('')
  const username = useField('text')
  const newPassword = useField('password')
  const securityAnswer = useField('text')
  useEffect(() => {
    setSecurityQuestion('')
    props.fetchBands()
  }, [])

  const handleReset = async (event) => {
    event.preventDefault()
    try {
      const formData = {
        username: username.value,
        newPassword: newPassword.value,
        securityAnswer: securityAnswer.value,
      }
      props.resetPassword(formData)
      props.showInfo('password reset successful', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error password reset', 3)
    }
  }

  const fetchQuestion = async () => {
    setSecurityQuestion('')
    const bandFound = props.bands.filter((band) => {
      return band.username === username.value
    })
    console.log(bandFound.length)
    console.log(JSON.stringify(bandFound))
    if (bandFound.length > 0) {
      console.log(JSON.stringify(bandFound[0]))
      console.log(bandFound[0].securityQuestion)
      setSecurityQuestion(bandFound[0].securityQuestion)
    }
  }

  const handleCancel = async (event) => {
    event.preventDefault()
    props.history.push('/')
  }

  return (
    <div className="container">
      <form onSubmit={handleReset}>
        <div className="form-group row">
          <h3 className="col-sm-5 px-0">Reset password</h3>
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
          <div className="col-sm-2">
            <button
              type="button"
              onClick={fetchQuestion}
              className="btn btn-primary mx-1"
              data-cy="cancel"
            >
              Fetch question
            </button>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="Password" className="col-sm-2 col-form-label px-0">
            New password
          </label>
          <div className="col-sm-3">
            <input
              className="form-control"
              data-cy="newPassword"
              autoComplete="new-password"
              {...removeReset(newPassword)}
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
          <div className="col-sm-3">{securityQuestion}</div>
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
            data-cy="reset-password"
          >
            reset password
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

const mapStateToProps = (state) => {
  return {
    bands: state.bands,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  resetPassword,
  fetchBands,
}

const ResetPasswordForm = withRouter(ResetPasswordNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordForm)
