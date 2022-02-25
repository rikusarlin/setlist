// eslint-disable-next-line no-unused-vars
const removeProperty = prop => ({ [prop]: _, ...rest }) => rest
export const removeReset = removeProperty('reset')