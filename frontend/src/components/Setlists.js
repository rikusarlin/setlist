import React, { useEffect } from 'react'
import { fetchSetlists, deleteSetlist } from '../reducers/setlistReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

export const SetlistsNoHistory = (props) => {
  useEffect(() => {
    props.fetchSetlists(props.band.token)
  }, [props.band.token])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await props.deleteSetlist(event.target.value, props.band.token)
      props.showInfo('deleted setlist', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting setlist', 3)
    }
  }

  if (props.setlists !== null) {
    const sortedSetlists = props.setlists.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    const setlistList = sortedSetlists.map((setlist) => (
      <form key={setlist.id} className="row" submit={handleSubmit}>
        <div className="col-sm-6">
          <Link data-cy="setlist-link" to={`/setlist/${setlist.id}`}>
            {setlist.name}
          </Link>
        </div>
        <div className="col-sm-2">
          <button
            type="submit"
            data-cy="delete_setlist"
            id={setlist.id}
            className="btn btn-danger"
          >
            delete setlist
          </button>
        </div>
      </form>
    ))

    if (props.band.username !== null) {
      return <div className="container">{setlistList}</div>
    }
  }
  return <div />
}

const mapStateToProps = (state) => {
  return {
    setlists: state.setlists,
    band: state.band,
  }
}

const mapDispatchToProps = {
  fetchSetlists,
  deleteSetlist,
}

const Setlists = withRouter(SetlistsNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Setlists)
