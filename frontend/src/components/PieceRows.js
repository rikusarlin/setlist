import React from 'react'

export const PieceRows = (props)  => {

  if ( props.piece === undefined || props.piece === null){
    return <div/>
  }

  let rowList =  <div className="row"><div className="col-md-8 label">[No pages found]</div></div>
  if(props.piece.pages !== undefined){
    rowList = props.piece.pages.map(page =>
      page.rows.map(row => {
        const cellStyles = 'col-md-12 '+row.rowType.toLowerCase()
        return <div key={page.pageNumber+'_'+row.rowNumber} className="row container">
          <div className={cellStyles}>{row.contents}</div>
        </div>
      })
    )
  }

  return(
    <div className="piece">
      <pre>
        {rowList}
      </pre>
    </div>
  )
}
export default PieceRows