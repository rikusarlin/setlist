import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePieceFromSetlist, movePiece } from '../reducers/setlistReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const SetlistNoHistory = (props) => {
  const setlistById = (id) => {
    if (props.setlists !== null) {
      var setlist = props.setlists.find((a) => a.id === id)
      return setlist
    } else {
      return null
    }
  }

  if (
    setlistById(props.setlistId) === undefined ||
    setlistById(props.setlistId) === null ||
    setlistById(props.setlistId).pieces.length === 0
  ) {
    return (
      <div>
        <h2>Setlist is empty!</h2>
      </div>
    )
  }

  const handleDeleteFromSetlist = async () => {
    try {
      props.deletePieceFromSetlist(props.setlistId, props.band.token)
      props.showInfo('piece deleted from setlist', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in deleting piece from setlist', 3)
    }
  }

  const handleMovePieceUp = async (event) => {
    props.movePiece(props.setlistId, event.target.value, 'up', props.band.token)
  }

  const handleMovePieceDown = async (event) => {
    props.movePiece(
      props.setlistId,
      event.target.value,
      'down',
      props.band.token
    )
  }

  const returnToSetlists = () => {
    props.history.push('/setlists')
  }

  const pieceList = setlistById(props.setlistId).pieces.map((piece) => (
    <tr key={piece.id}>
      <td>
        <Link data-cy="piece-link" to={`/piece/${piece.id}`}>
          {piece.title}
        </Link>
      </td>
      <td>
        <button
          onClick={handleDeleteFromSetlist}
          data-cy="delete"
          className="col-sm-2 mr-2 btn btn-danger"
          type="button"
        >
          delete
        </button>
      </td>
      <td>
        <button
          onClick={handleMovePieceUp}
          data-cy="move-piece-down"
          className="col-sm-2 mr-2 btn btn-primary"
          id={piece.id}
          type="button"
        >
          down
        </button>
      </td>
      <td>
        <button
          onClick={handleMovePieceDown}
          data-cy="move-piece-down"
          className="col-sm-2 mr-2 btn btn-primary"
          id={piece.id}
          type="button"
        >
          up
        </button>
      </td>
    </tr>
  ))

  return (
    <div>
      <h2>{setlistById(props.setlistId).name}</h2>
      <Table striped>
        <tbody>{pieceList}</tbody>
      </Table>

      <button
        onClick={returnToSetlists}
        data-cy="back"
        className="col-sm-1 mr-2 my-2 btn btn-primary"
      >
        back
      </button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    band: state.band,
    setlists: state.setlists,
  }
}

const mapDispatchToProps = {
  showInfo,
  showError,
  deletePieceFromSetlist,
  movePiece,
}

const Setlist = withRouter(SetlistNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Setlist)
