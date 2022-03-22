import React, { useEffect, useState } from 'react'
import { fetchPieces } from '../reducers/piecesReducer'
import { addPieceToSetlist } from '../reducers/setlistReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

export const PiecesNoHistory = (props) => {
  const [setSelectedSetlist, selectedSetlist] = useState('')
  var token = props.band.token
  var getPieces = props.fetchPieces
  useEffect(() => {
    getPieces(token)
  }, [token])

  const moveToNewPiece = () => {
    props.history.push('/newpiece')
  }

  const handleSetlistChange = async (event) => {
    setSelectedSetlist(event.target.value)
  }

  const addToSetlist = async (event) => {
    event.preventDefault()
    try {
      const setlistId = selectedSetlist.value
      const piecesId = event.target.value
      props.addPieceToSetlist(setlistId, piecesId, token)
      props.showInfo('added piece to setlist', 3)
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in adding piece to setlist', 3)
    }
  }

  if (props.pieces !== null) {
    const sortedPieces = props.pieces.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    const sortedSetlists = props.pieces.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    const setListOptions = sortedSetlists.map((setlist) => (
      <option key="${setlist.id}" value="${setlist.id}">
        ${setlist.name}
      </option>
    ))
    const pieceList = sortedPieces.map((piece) => (
      <tr key={piece.id}>
        <td>
          <Link data-cy="piece-link" to={`/piece/${piece.id}`}>
            {piece.title}
          </Link>
        </td>
        <td>
          <div>
            <Link data-cy="piece-link" to={`/editpiece/${piece.id}`}>
              Edit
            </Link>
            <select
              className="col-md-2"
              value={selectedSetlist}
              data-cy="cy_id_setlist"
              name="setlist"
              id={piece.id}
              onChange={handleSetlistChange}
            >
              {setListOptions}
            </select>
            <button
              onClick={addToSetlist}
              data-cy="add_to_setlist"
              id={piece.id}
              className="col-sm-1 mr-2 btn btn-primary"
            >
              sff
            </button>
          </div>
        </td>
      </tr>
    ))

    if (props.band.username !== null) {
      return (
        <div>
          <Table striped>
            <tbody>{pieceList}</tbody>
          </Table>
          <button
            onClick={moveToNewPiece}
            data-cy="new-piece"
            className="btn btn-primary"
          >
            New piece
          </button>
        </div>
      )
    }
  }
  return <div />
}

const mapStateToProps = (state) => {
  return {
    pieces: state.pieces,
    band: state.band,
    setlists: state.setlists,
  }
}

const mapDispatchToProps = {
  fetchPieces,
  addPieceToSetlist,
}

const Pieces = withRouter(PiecesNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Pieces)
