import React from 'react'

export const PieceRows = (props) => {
  if (props.piece === undefined || props.piece === null) {
    return <div />
  }

  let rowList = (
    <div className="row">
      <div className="col-md-8 label">[No pages found]</div>
    </div>
  )
  if (props.piece.pages !== undefined) {
    let instrumentIndex = -1
    if (
      typeof props.selectedInstrument !== 'undefined' &&
      props.selectedInstrument !== 'choose'
    ) {
      instrumentIndex = props.piece.notes.findIndex(
        (note) => note.instrument === props.selectedInstrument
      )
    }
    rowList = props.piece.pages.map((page) =>
      page.rows.map((row) => {
        let contents = row.contents !== '' ? row.contents : ' '
        let rowIndex = -1
        if (instrumentIndex >= 0) {
          rowIndex = props.piece.notes[instrumentIndex].rows.findIndex(
            (noteRow) => noteRow.rowNumber == row.rowNumber
          )
        }
        let pieceCellStyles = row.rowType.toLowerCase()
        const noteCellStyles = 'lyrics'
        let noteContents = <div />
        if (rowIndex >= 0) {
          pieceCellStyles = pieceCellStyles + ' col-md-6'
          noteContents = (
            <div className={noteCellStyles}>
              {props.piece.notes[instrumentIndex].rows[rowIndex].contents}
            </div>
          )
        } else {
          pieceCellStyles = pieceCellStyles + ' col-md-12'
        }
        return (
          <div
            key={page.pageNumber + '_' + row.rowNumber}
            className="row container"
          >
            <div className={pieceCellStyles}>{contents}</div>
            {noteContents}
          </div>
        )
      })
    )
  }

  return (
    <div className="piece">
      <pre>{rowList}</pre>
    </div>
  )
}
export default PieceRows
