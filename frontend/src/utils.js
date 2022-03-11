const removeProperty =
  (prop) =>
  // eslint-disable-next-line no-unused-vars
  ({ [prop]: _, ...rest }) =>
    rest
export const removeReset = removeProperty('reset')
