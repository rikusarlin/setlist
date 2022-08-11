import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { showInfo, showError } from '../reducers/notificationReducer'
import {
  deletePieceFromSetlist,
  movePiece,
  getSetlist,
} from '../reducers/setlistReducer'
import { connect } from 'react-redux'
import { withRouter } from '../utils'

export const SetlistNoHistory = (props) => {
  //var token = props.band.token
  //var fetchSetlist = props.getSetlist
  useEffect(() => {
    props.getSetlist(props.router.params.setlistId, props.band.token)
  }, [props.router.params.setlistId])

  if (
    props.setlist === undefined ||
    props.setlist === null ||
    props.setlist.pieces === undefined ||
    props.setlist.pieces === null ||
    props.setlist.pieces.length === 0
  ) {
    return (
      <div>
        <h2>Setlist is empty!</h2>
      </div>
    )
  }

  const handleDeleteFromSetlist = async (event) => {
    event.preventDefault()
    try {
      props.deletePieceFromSetlist(
        props.router.params.setlistId,
        event.target.value,
        props.band.token
      )
      props.showInfo('piece deleted from setlist', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting piece from setlist', 3)
    }
  }

  const handleMovePieceUp = async (event) => {
    props.movePiece(
      props.router.params.setlistId,
      event.target.value,
      'up',
      props.band.token
    )
  }

  const handleMovePieceDown = async (event) => {
    props.movePiece(
      props.router.params.setlistId,
      event.target.value,
      'down',
      props.band.token
    )
  }

  const returnToSetlists = () => {
    props.router.navigate('/setlists')
  }

  const pieceList = props.setlist.pieces.map((piece, index) => {
    return (
      <div className="row" key={index}>
        <div className="col-sm-6">
          <Link
            data-cy="piece-link"
            to={`/setlistpiece/${props.router.params.setlistId}/${piece.id}`}
          >
            {piece.title}
          </Link>
        </div>
        <div className="col-sm-1">
          <button
            onClick={handleMovePieceUp}
            data-cy="move-piece-down"
            className="mr-2 py-0 btn btn-primary"
            value={piece.id}
            type="basic"
            disabled={index === 0}
          >
            up
          </button>
        </div>
        <div className="col-sm-1">
          <button
            onClick={handleMovePieceDown}
            data-cy="move-piece-down"
            className="mr-2 py-0 btn btn-primary"
            value={piece.id}
            type="basic"
            disabled={index === props.setlist.pieces.length - 1}
          >
            down
          </button>
        </div>
        <div className="col-sm-2">
          <button
            onClick={handleDeleteFromSetlist}
            data-cy="delete-from-list"
            className="mr-2 py-0 btn btn-danger"
            value={piece.id}
            type="basic"
          >
            delete
          </button>
        </div>
      </div>
    )
  })

  return (
    <div className="container">
      <div className="row">
        <h2>{props.setlist.name}</h2>
      </div>
      <div className="container">{pieceList}</div>
      <div className="row">
        <button
          onClick={returnToSetlists}
          data-cy="back"
          className="col-sm-1 mr-2 my-2 btn btn-primary"
        >
          back
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    setlist: state.setlist,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  deletePieceFromSetlist,
  movePiece,
  getSetlist,
}

const Setlist = withRouter(SetlistNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Setlist)
