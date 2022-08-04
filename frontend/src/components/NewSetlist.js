import React from 'react'
import Togglable from './Togglable'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createSetlist } from '../reducers/setlistsReducer'
import { connect } from 'react-redux'
import { useField } from '../hooks'
import { removeReset } from '../utils'

export const NewSetlist = (props) => {
  const name = useField('text')

  const setlistFormRef = React.createRef()

  const handlePost = async (event) => {
    event.preventDefault()

    try {
      setlistFormRef.current.toggleVisibility()
      await props.createSetlist(name.value, props.band.token)
      name.reset()
      props.showInfo('added new setlist', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in adding new setlist', 3)
    }
  }

  return (
    <Togglable buttonLabel="new setlist" ref={setlistFormRef}>
      <div>
        <h3>New setlist</h3>
        <form onSubmit={handlePost}>
          <div className="form-group row">
            <label htmlFor="SetlistName" className="col-sm-2 col-form-label">
              Setlist name
            </label>
            <input
              className="col-sm-4"
              data-cy="name"
              id="name"
              {...removeReset(name)}
            />
          </div>
          <button
            type="submit"
            data-cy="create"
            className="btn btn-primary my-2"
          >
            create
          </button>
        </form>
      </div>
    </Togglable>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
  }
}

const mapDispatchToProps = {
  createSetlist,
  showInfo,
  showError,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSetlist)
