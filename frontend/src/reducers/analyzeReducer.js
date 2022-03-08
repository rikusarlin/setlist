import analyzeService from '../services/analyze'
import piecesService from '../services/pieces'

export const analyzeContents = (contents, token) => {
  return async dispatch => {
    const analyzedContents = await analyzeService.analyze(contents, token)
    //console.log(JSON.stringify(analyzedContents))
    dispatch({
      type: 'ANALYZE_PIECE',
      data: analyzedContents,
    })
  }
}

export const updatePiece = (piece, token) => {
  return async dispatch => {
    const updatedPiece = await piecesService.update(piece, token)
    //console.log(JSON.stringify(updatedPiece))
    dispatch({
      type: 'UPDATE_PIECE',
      data: updatedPiece,
    })
  }
}

export const transposeUp = (piece, token) => {
  return async dispatch => {
    const updatedPiece = await piecesService.transpose(piece, 'up', token)
    //console.log(JSON.stringify(updatedPiece))
    dispatch({
      type: 'TRANSPOSE_PIECE',
      data: updatedPiece,
    })
  }
}

export const transposeDown = (piece, token) => {
  return async dispatch => {
    const updatedPiece = await piecesService.transpose(piece, 'down', token)
    //console.log(JSON.stringify(updatedPiece))
    dispatch({
      type: 'TRANSPOSE_PIECE',
      data: updatedPiece,
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
  case 'UPDATE_PIECE':
    return action.data
  case 'TRANSPOSE_PIECE':
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