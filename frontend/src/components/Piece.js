import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece } from '../reducers/piecesReducer'
import { fetchPiece, emptyPiece } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'

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

    return(
      <div>
        <h2>{props.piece.title} by {props.piece.artist}</h2>
        Played at {props.piece.bpm} bpm <br/>
        <PieceRows piece={props.piece}/>
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
