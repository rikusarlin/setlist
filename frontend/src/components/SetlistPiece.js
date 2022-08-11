import React, { useEffect, useState } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { fetchPiece } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from '../utils'
import PieceRows from './PieceRows'
import NoteSelectionList from './NoteSelectionList'
import { Link, Element } from 'react-scroll'

export const SetlistPieceNoHistory = (props) => {
  const [selectedNote, setSelectedNote] = useState('choose')
  useEffect(() => {
    const fetchData = async () => {
      await props.fetchPiece(props.router.params.pieceId, props.band.token)
    }
    fetchData()
  }, [props.router.params.pieceId])

  if (props.piece === undefined || props.piece === null || props.piece === []) {
    return <div />
  }

  const returnToSetlist = () => {
    props.router.navigate(`/setlist/${props.router.params.setlistId}`)
  }

  const prevPiece = () => {
    const pieceIndex = props.setlist.pieces.findIndex(
      (piece) => piece.id === props.router.params.pieceId
    )
    if (pieceIndex > 0) {
      props.router.navigate(
        `/setlistpiece/${props.router.params.setlistId}/${
          props.setlist.pieces[pieceIndex - 1].id
        }`
      )
    }
  }

  const nextPiece = () => {
    const pieceIndex = props.setlist.pieces.findIndex(
      (piece) => piece.id === props.router.params.pieceId
    )
    if (pieceIndex !== props.setlist.pieces.length - 1) {
      props.router.navigate(
        `/setlistpiece/${props.router.params.setlistId}/${
          props.setlist.pieces[pieceIndex + 1].id
        }`
      )
    }
  }

  const selectNote = (event) => {
    setSelectedNote(event.target.value)
  }

  if (props.band.username !== null) {
    return (
      <div>
        <Element name="topOfPage" />
        <h2>
          {props.piece.title} by {props.piece.artist}
        </h2>
        Piece length {props.piece.duration} seconds <br />
        Delay before start of scroll {props.piece.delay} seconds <br />
        <Link
          className="col-sm-2 mr-2 py-0 btn btn-primary white-color"
          activeClass="active"
          to="bottomOfPage"
          smooth={true}
          offset={50}
          delay={props.piece.delay * 1000}
          duration={props.piece.duration * 0.7 * 1000}
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
        <NoteSelectionList
          selectedNote={selectedNote}
          onChange={selectNote}
          className="mx-2"
        />
        <button
          onClick={returnToSetlist}
          data-cy="back"
          className="col-sm-1 mr-2 my-2 py-0 btn btn-primary"
        >
          back
        </button>
        <PieceRows piece={props.piece} selectedInstrument={selectedNote} />
        <Link
          className="col-sm-2 mr-2 py-0 btn btn-primary white-color"
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
        <NoteSelectionList
          selectedNote={selectedNote}
          onChange={selectNote}
          className="mx-2"
        />
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
    setlist: state.setlist,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  fetchPiece,
}

const SetlistPiece = withRouter(SetlistPieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(SetlistPiece)
