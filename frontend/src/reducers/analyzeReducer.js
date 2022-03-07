import analyzeService from '../services/analyze'

export const analyzeContents = (contents) => {
  return async dispatch => {
    const analyzedContents = await analyzeService.analyze(contents)
    console.log(JSON.stringify(analyzedContents))
    dispatch({
      type: 'ANALYZE_PIECE',
      data: analyzedContents,
    })
  }
}

export const clearAnalysis = () => {
  return async dispatch => {
    dispatch({
      type: 'CLEAR_ANALYSIS',
      data: null,
    })
  }
}

const reducer = (state = [], action) => {
  console.log('state before action in analyzeReducer: ', state)
  console.log('action in analyzeReducer', action)

  switch(action.type) {
  case 'ANALYZE_PIECE':
    return action.data
  case 'CLEAR_ANALYSIS':
    return null
  default:
    return state
  }
}

export default reducer