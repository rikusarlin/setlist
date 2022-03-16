import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchBands } from '../reducers/bandReducer'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'

export const Bands = (props) => {
  var band = props.band.username
  var getBands = props.fetchBands
  useEffect(() => {
    getBands()
  }, [band, getBands])

  if (props.bands !== null) {
    const sortedBands = props.bands.sort((a, b) => b.name - a.name)
    const bandList = sortedBands.map((band) => (
      <tr key={band.id}>
        <td className="col-sm-1">
          <Link to={`/bands/${band.id}`}>{band.name}</Link>
        </td>
      </tr>
    ))
    if (props.band.username !== null) {
      return (
        <Table striped>
          <thead>
            <tr>
              <th className="col-sm-1">Band name</th>
            </tr>
          </thead>
          <tbody>{bandList}</tbody>
        </Table>
      )
    } else {
      return <div />
    }
  } else {
    return <div>No bands found</div>
  }
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    bands: state.bands,
  }
}

const mapDispatchToProps = {
  fetchBands,
}

export default connect(mapStateToProps, mapDispatchToProps)(Bands)
