const removeProperty =
  (prop) =>
  // eslint-disable-next-line no-unused-vars
  ({ [prop]: _, ...rest }) =>
    rest
export const removeReset = removeProperty('reset')

export const calculateLineHeight = (element) => {
  var lineHeight = parseInt(getComputedStyle(element, 'line-height'), 10)
  var clone
  var singleLineHeight
  var doubleLineHeight
  if (isNaN(lineHeight)) {
    clone = element.cloneNode()
    clone.innerHTML = '<br>'
    element.appendChild(clone)
    singleLineHeight = clone.offsetHeight
    clone.innerHTML = '<br><br>'
    doubleLineHeight = clone.offsetHeight
    element.removeChild(clone)
    lineHeight = doubleLineHeight - singleLineHeight
  }
  return lineHeight
}

export const calculateDuration = (piece) => {
  const numberOfRows = getNumberOfRows(piece)
  console.log('numberOfRows: ' + numberOfRows)
  const windowSize = window.innerHeight
  console.log('windowSize: ' + windowSize)
  const lineHeight = calculateLineHeight(document.querySelector('div'))
  console.log('lineHeight: ' + lineHeight)
  const rowsPerWindow = windowSize / lineHeight
  console.log('rowsPerWindow: ' + rowsPerWindow)
  // assume reasonable default since bpm need not always be defined
  let secondsPerRow = 180 / (numberOfRows * 1.0)
  if (parseInt(piece.bpm) !== null && piece.bpm !== 0) {
    secondsPerRow = piece.bpm / (numberOfRows * 1.0)
  }
  console.log('secondsPerRow: ' + secondsPerRow)
  // Have to substract some row because of menu, title, buttons and so on
  let delay = (rowsPerWindow - 10) * secondsPerRow
  console.log('delay: ' + delay)
  if (delay < 0) {
    delay = 0
  }
  // We should scroll so that we reach beginning of last page in time
  const duration = piece.bpm - 2 * ((rowsPerWindow - 8) * secondsPerRow)
  console.log('duration: ' + duration)
  return [1000 * delay, 1000 * duration]
}

export const getNumberOfRows = (piece) => {
  if (piece.pages !== undefined) {
    return piece.pages.reduce((sum, page) => sum + page.rows.length, 0)
  } else {
    // Reasonable default just in case
    return 50
  }
}
