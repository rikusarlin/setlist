import React, { useEffect } from 'react'
import { fetchSetlists, deleteSetlist } from '../reducers/setlistReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

export const SetlistsNoHistory = (props) => {
  useEffect(() => {
    const fetchData = async () => {
      await props.fetchSetlists(props.band.token)
    }
    fetchData()
  }, [props.band.token])

  const handleDelete = async (id) => {
    try {
      await props.deleteSetlist(id, props.band.token)
      await props.fetchSetlists(props.band.token)
      props.showInfo('deleted setlist', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting setlist', 3)
    }
  }

  const confirmDelete = (id) => {
    if (window.confirm(`Really remove setlist?`)) {
      handleDelete(id)
    }
  }

  if (props.setlists !== null) {
    /*
    const sortedSetlists = props.setlists.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    */
    const setlistList = props.setlists.map((setlist, index) => {
      return (
        <div className="row" key={index}>
          <div className="col-sm-6">
            <Link data-cy="setlist-link" to={`/setlist/${setlist.id}`}>
              {setlist.name}
            </Link>
          </div>
          <div className="col-sm-2">
            <button
              type="basic"
              data-cy="delete_setlist"
              value={setlist.id}
              className="btn btn-danger py-0"
              onClick={(e) => {
                confirmDelete(e.target.value)
              }}
            >
              delete setlist
            </button>
          </div>
        </div>
      )
    })

    if (props.band.username !== null) {
      return <div className="container striped">{setlistList}</div>
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
  showInfo,
  showError,
}

const Setlists = withRouter(SetlistsNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Setlists)
