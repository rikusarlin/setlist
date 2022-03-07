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

export const changeRowType = (page, row, newRowType) => {
  return async dispatch => {
    dispatch({
      type: 'CHANGE_ROW_TYPE',
      data: {
        page: page,
        row: row,
        rowType: newRowType
      },
    })
  }
}

export const changeContents = (page, row, newContents) => {
  return async dispatch => {
    dispatch({
      type: 'CHANGE_CONTENTS',
      data: {
        page: page,
        row: row,
        contents: newContents
      },
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
  case 'CHANGE_ROW_TYPE':{
    const pages = state.pages.map((page) =>
      page.pageNumber === action.data.page ? { ...page, rows: page.rows.map((row) =>
        row.rowNumber === action.data.row ? { ...row, rowType: action.data.rowType } : row
      ) } : page
    )
    console.log('New value for pages: '+JSON.stringify(pages))
    return { ...state, pages }
  }
  case 'CHANGE_CONTENTS':{
    const pages = state.pages.map((page) =>
      page.pageNumber === action.data.page ? { ...page, rows: page.rows.map((row) =>
        row.rowNumber === action.data.row ? { ...row, contents: action.data.contents } : row
      ) } : page
    )
    console.log('New value for pages: '+JSON.stringify(pages))
    return { ...state, pages }
  }
  case 'CLEAR_ANALYSIS':
    return null
  default:
    return state
  }
}

export default reducer