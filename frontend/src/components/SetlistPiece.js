import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { fetchPiece } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'
import { Link, Element } from 'react-scroll'
import { calculateDuration } from '../utils'

export const SetlistPieceNoHistory = (props) => {
  useEffect(() => {
    const fetchData = async () => {
      await props.fetchPiece(props.pieceId, props.band.token)
    }
    fetchData()
  }, [props.pieceId])

  if (props.piece === undefined || props.piece === null || props.piece === []) {
    return <div />
  }

  const returnToSetlist = () => {
    props.history.push(`/setlist/${props.setlistId}`)
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

  const [pieceDelay, pieceDuration] = calculateDuration(props.piece)

  if (props.band.username !== null) {
    return (
      <div>
        <Element name="topOfPage" />
        <h2>
          {props.piece.title} by {props.piece.artist}
        </h2>
        Piece length {props.piece.bpm} seconds <br />
        <Link
          className="col-sm-2 mr-2 btn btn-primary white-color"
          activeClass="active"
          to="bottomOfPage"
          smooth={true}
          offset={50}
          duration={pieceDuration}
          delay={pieceDelay}
          isDynamic={true}
        >
          play
        </Link>
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
        <Link
          className="col-sm-2 mr-2 btn btn-primary white-color"
          activeClass="active"
          to="topOfPage"
          smooth={true}
        >
          top
        </Link>
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
        <Element name="bottomOfPage" />
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

const SetlistPiece = withRouter(SetlistPieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(SetlistPiece)
