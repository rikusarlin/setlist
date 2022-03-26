import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece } from '../reducers/piecesReducer'
import {
  transposeDown,
  transposeUp,
  fetchPiece,
} from '../reducers/pieceReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PieceRows from './PieceRows'

export const PieceNoHistory = (props) => {
  var token = props.band.token
  var getPiece = props.fetchPiece
  useEffect(() => {
    getPiece(props.pieceId, token)
  }, [token, getPiece])

  if (props.piece === undefined || props.piece === null) {
    return <div />
  }

  const handleDelete = async () => {
    try {
      props.deletePiece(props.piece.id, props.band.token)
      props.showInfo('piece deleted', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting piece', 3)
    }
  }

  const confirmDelete = () => {
    if (
      window.confirm(`Remove ${props.piece.title} by ${props.piece.artist}?`)
    ) {
      handleDelete()
    }
  }
  const transposeUp = async () => {
    try {
      props.transposeUp(props.piece, props.band.token)
      props.showInfo('piece transposed up', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in transposing piece up', 3)
    }
  }

  const transposeDown = async () => {
    try {
      props.transposeDown(props.piece, props.band.token)
      props.showInfo('piece transposed down', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in transposing piece down', 3)
    }
  }

  const returnToPieces = () => {
    props.history.push('/pieces')
  }

  if (props.band.username !== null) {
    return (
      <div>
        <div className="piece">
          <h2>
            {props.piece.title} by {props.piece.artist}
          </h2>
          Piece length {props.piece.bpm} seconds <br />
          <PieceRows piece={props.piece} />
        </div>
        <div className="commands">
          <button
            onClick={transposeUp}
            data-cy="transposeUp"
            className="col-sm-2 mr-2 btn btn-primary"
          >
            transpose up
          </button>
          <button
            onClick={transposeDown}
            data-cy="transposeDown"
            className="col-sm-2 mr-2 btn btn-primary"
          >
            transpose down
          </button>
          <button
            onClick={confirmDelete}
            data-cy="delete"
            className="col-sm-2 mr-2 btn btn-danger"
            type="button"
          >
            delete
          </button>
          <button
            onClick={returnToPieces}
            data-cy="back"
            className="col-sm-1 mr-2 my-2 btn btn-primary"
          >
            back
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    piece: state.piece,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  deletePiece,
  fetchPiece,
  transposeDown,
  transposeUp,
}

const Piece = withRouter(PieceNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Piece)
