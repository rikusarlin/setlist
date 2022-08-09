import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation()
    let navigate = useNavigate()
    let params = useParams()
    return <Component {...props} router={{ location, navigate, params }} />
  }

  return ComponentWithRouterProp
}

const removeProperty =
  (prop) =>
  // eslint-disable-next-line no-unused-vars
  ({ [prop]: _, ...rest }) =>
    rest
export const removeReset = removeProperty('reset')
