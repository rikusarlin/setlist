import React, { useEffect } from 'react'
import { fetchSetlists } from '../reducers/setlistReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

export const SetlistsNoHistory = (props) => {
  useEffect(() => {
    props.fetchSetlists(props.band.token)
  }, [props.band.token])

  if (props.setlists !== null) {
    const sortedSetlists = props.setlists.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    const setlistList = sortedSetlists.map((setlist) => (
      <tr key={setlist.id}>
        <td>
          <Link data-cy="setlist-link" to={`/setlist/${setlist.id}`}>
            {setlist.name}
          </Link>
        </td>
      </tr>
    ))

    if (props.band.username !== null) {
      return (
        <div>
          <Table striped>
            <tbody>{setlistList}</tbody>
          </Table>
        </div>
      )
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
}

const Setlists = withRouter(SetlistsNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Setlists)
