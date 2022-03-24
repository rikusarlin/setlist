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

  const calculateDuration = (piece) => {
    const numberOfRows = getNumberOfRows(piece)
    const windowSize = window.innerHeight
    const lineHeight = calculateLineHeight(document.querySelector('div'))
    const rowsPerWindow = windowSize / lineHeight
    // assume reasonable default since bpm need not always be defined
    let secondsPerRow = (numberOfRows * 1.0) / 180
    if (parseInt(piece.bpm) !== null && piece.bpm !== 0) {
      secondsPerRow = (numberOfRows * 1.0) / piece.bpm
    }
    // Have to substract some row because of menu, title, buttons and so on
    let delay = (rowsPerWindow - 8) * secondsPerRow
    if (delay < 0) {
      delay = 0
    }
    // We should scroll so that we reach beginning of last page in time
    const duration = piece.bpm - 2 * ((rowsPerWindow - 8) * secondsPerRow)
    return [1000 * delay, 1000 * duration]
  }

  const getNumberOfRows = (piece) => {
    if (piece.pages !== undefined) {
      return piece.pages.reduce((sum, page) => sum + page.rows.length, 0)
    } else {
      // Reasonable default just in case
      return 50
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
          className="col-sm-2 mr-2 py-0 btn btn-primary white-color"
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
