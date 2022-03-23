import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { fetchPiece } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'

export const PieceNoHistory = (props) => {
  var token = props.band.token
  var getPiece = props.fetchPiece
  useEffect(() => {
    getPiece(props.pieceId, token)
  }, [token, getPiece, props.pieceId])

  if (props.piece === undefined || props.piece === null) {
    return <div />
  }

  const returnToSetlist = () => {
    props.history.push(`/setlist/${props.setlistId}`)
  }

  const playPiece = () => {
    window.alert(`Play functionality will be added later`)
  }

  const prevPiece = () => {
    const setlist = props.setlists.find((a) => a.id === props.setlistId)
    const pieceIndex = setlist.pieces.findIndex(
      (piece) => piece.id === props.pieceId
    )
    if (pieceIndex > 0) {
      props.history.push(
        `/setlistpiece/${props.setlistId}/${setlist.pieces[pieceIndex - 1].id}`
      )
    }
  }

  const nextPiece = () => {
    const setlist = props.setlists.find((a) => a.id === props.setlistId)
    const pieceIndex = setlist.pieces.findIndex(
      (piece) => piece.id === props.pieceId
    )
    if (pieceIndex !== setlist.pieces.length - 1) {
      props.history.push(
        `/setlistpiece/${props.setlistId}/${setlist.pieces[pieceIndex + 1].id}`
      )
    }
  }

  if (props.band.username !== null) {
    return (
      <div>
        <h2>
          {props.piece.title} by {props.piece.artist}
        </h2>
        Played at {props.piece.bpm} bpm <br />
        <button
          onClick={playPiece}
          data-cy="playPiece"
          className="col-sm-2 mr-2 py-0 btn btn-primary"
          type="basic"
        >
          play
        </button>
        <button
          onClick={prevPiece}
          data-cy="prevPiece"
          className="col-sm-2 mr-2 py-0 btn btn-primary"
          type="next"
        >
          prev
        </button>
        <button
          onClick={nextPiece}
          data-cy="nextPiece"
          className="col-sm-2 mr-2 py-0 btn btn-primary"
          type="basic"
        >
          next
        </button>
        <button
          onClick={returnToSetlist}
          data-cy="back"
          className="col-sm-1 mr-2 my-2 py-0 btn btn-primary"
        >
          back
        </button>
        <PieceRows piece={props.piece} />
        <button
          onClick={playPiece}
          data-cy="playPiece"
          className="col-sm-2 mr-2 py-0 btn btn-primary"
          type="basic"
        >
          play
        </button>
        <button
          onClick={prevPiece}
          data-cy="prevPiece"
          className="col-sm-2 mr-2 py-0 btn btn-primary"
          type="next"
        >
          prev
        </button>
        <button
          onClick={nextPiece}
          data-cy="nextPiece"
          className="col-sm-2 mr-2 py-0 btn btn-primary"
          type="basic"
        >
          next
        </button>
        <button
          onClick={returnToSetlist}
          data-cy="back"
          className="col-sm-1 mr-2 my-2 py-0 btn btn-primary"
        >
          back
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    piece: state.piece,
    setlists: state.setlists,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  fetchPiece,
}

const Piece = withRouter(PieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Piece)
