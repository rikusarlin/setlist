import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { fetchPiece } from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'
import { Link, Element } from 'react-scroll'

export const SetlistPieceNoHistory = (props) => {
  useEffect(() => {
    const fetchData = async () => {
      console.log('In fetchData, pieceId: ' + props.pieceId)
      await props.fetchPiece(props.pieceId, props.band.token)
      console.log('In fetchData, piece: ' + JSON.stringify(props.piece))
    }
    fetchData()
  }, [props.pieceId])

  if (props.piece === undefined || props.piece === null || props.piece === []) {
    return <div />
  } else {
    console.log(
      'Props.piece is not null or undefined or empty array, but: ' +
        JSON.stringify(props.piece)
    )
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

  const calculateLineHeight = (element) => {
    var lineHeight = parseInt(getComputedStyle(element, 'line-height'), 10)
    var clone
    var singleLineHeight
    var doubleLineHeight
    if (isNaN(lineHeight)) {
      clone = element.cloneNode()
      clone.innerHTML = '<br>'
      element.appendChild(clone)
      singleLineHeight = clone.offsetHeight
      clone.innerHTML = '<br><br>'
      doubleLineHeight = clone.offsetHeight
      element.removeChild(clone)
      lineHeight = doubleLineHeight - singleLineHeight
    }
    return lineHeight
  }

  const calculateDuration = () => {
    console.log('Piece: ' + JSON.stringify(props.piece))
    const numberOfRows = getPieceRows().length
    const windowSize = window.innerHeight
    console.log('windowSize: ' + windowSize)
    const lineHeight = calculateLineHeight(
      document.querySelector('.cellStyles')
    )
    console.log('lineHeight: ' + lineHeight)
    const rowsPerWindow = windowSize / lineHeight
    console.log('rowsPerWindow: ' + rowsPerWindow)
    const pages = (numberOfRows * 1.0) / rowsPerWindow
    console.log('pages: ' + pages)
    // piece.bpm is actually considered the number of seconds the piece is played in band's arrangement
    const secondsPerRow = (numberOfRows * 1.0) / props.piece.bpm
    console.log('secondsPerRow: ' + secondsPerRow)
    const delay = 1000 * (rowsPerWindow * secondsPerRow)
    console.log('delay: ' + delay)
    var duration
    if (pages > 1) {
      duration = 1000 * (pages - 1 * (rowsPerWindow * secondsPerRow))
    } else {
      duration = 0
    }
    console.log('duration: ' + duration)
    return [delay, duration]
  }

  const getPieceRows = () => {
    return props.piece.pages.map((page) => page.rows.map((row) => row.contents))
  }

  const [pieceDelay, pieceDuration] = calculateDuration(props.piece)

  if (
    props.band.username !== null &&
    props.piece !== null &&
    props.piece !== []
  ) {
    return (
      <div>
        <Element name="topOfPage" />
        <h2>
          {props.piece.title} by {props.piece.artist}
        </h2>
        Played at {props.piece.bpm} bpm <br />
        <Link
          activeClass="active"
          to="bottomOfPage"
          smooth={true}
          offset={50}
          duration={pieceDuration}
          delay={pieceDelay}
          Piece
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
        <Link activeClass="active" to="topOfPage" smooth={true}>
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
