import React from 'react'
import { withRouter } from 'react-router-dom'

const BandNoHistory = (props) => {
  if (props.band === undefined) {
    props.router.navigate('/pieces')
    return <div />
  }
  return (
    <div>
      <h2>{props.band.name}</h2>
    </div>
  )
}

const Band = withRouter(BandNoHistory)

export default Band
