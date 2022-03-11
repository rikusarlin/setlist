import React from 'react'

export const EditablePieceRows = (props) => {
  if (props.piece === undefined || props.piece === null) {
    return <div />
  }

  let rowList = (
    <div className="row">
      <div className="col-md-8 label">[No pages found]</div>
    </div>
  )
  if (props.piece.pages !== undefined) {
    rowList = props.piece.pages.map((page) =>
      page.rows.map((row) => {
        const cellStyles =
          'row container col-md-12 ' + row.rowType.toLowerCase()
        const id = page.pageNumber + '_' + row.rowNumber
        const cy_id_contents =
          'contents_' + page.pageNumber + '_' + row.rowNumber
        const cy_id_rowtype = 'rowtype_' + page.pageNumber + '_' + row.rowNumber
        return (
          <div key={id} className={cellStyles}>
            <select
              className="col-md-2"
              value={row.rowType}
              data-cy={cy_id_rowtype}
              name="rowType"
              id={id}
              onChange={props.handleFieldChange}
            >
              <option value="Label">Label</option>
              <option value="Chords">Chords</option>
              <option value="Lyrics">Lyrics</option>
            </select>
            <input
              className="col-md-8"
              data-cy={cy_id_contents}
              name="contents"
              id={id}
              value={row.contents}
              onChange={props.handleFieldChange}
            />
          </div>
        )
      })
    )
  }

  return <div className="piece">{rowList}</div>
}
export default EditablePieceRows
