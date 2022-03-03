import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece } from '../reducers/piecesReducer'
import { fetchPiece, emptyPiece } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const PieceNoHistory = (props)  => {
  var token=props.user.token
  var getPiece = props.fetchPiece
  useEffect(() => {
    getPiece(props.pieceId, token)
  }, [token, getPiece])

  if ( props.piece === undefined || props.piece === null){
    return <div/>
  }

  const handleDelete = async () => {
    try {
      props.emptyPiece()
      props.deletePiece(props.piece.id, props.user.token)
      props.showInfo('piece deleted', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in deleting piece', 3)
    }
  }

  const confirmDelete = () => {
    if(window.confirm(`Remove ${props.piece.title} by ${props.piece.artist}?`)){
      handleDelete()
    }

  }

  if(props.user.username !== null){

    let deletePiece = <button className="btn btn-danger" type="button" onClick={confirmDelete}>delete</button>

    let rowList =  <div className="row"><div className="col-md-8 label">[No pages found]</div></div>
    if(props.piece.pages !== undefined){
      rowList = props.piece.pages.map(page =>
        page.rows.map(row => {
          const cellStyles = 'col-md-12 '+row.rowType.toLowerCase()
          return <div key={row.id} className="row container"><div className={cellStyles}>{row.contents}</div></div>
        })
      )
    }

    return(
      <div>
        <h2>{props.piece.title} by {props.piece.artist}</h2>
        Played at {props.piece.bpm} bpm <br/>
        <div className="piece">
          <pre>
            {rowList}
          </pre>
        </div>
        {deletePiece}<br/>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    piece: state.piece
  }
}

const mapDispatchToProps = {
  showInfo, showError, deletePiece, fetchPiece, emptyPiece
}

const Piece = withRouter(PieceNoHistory)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Piece)
