import React, { useEffect } from 'react'
import { fetchPieces } from '../reducers/piecesReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

export const PiecesNoHistory = (props) => {
  var token = props.band.token
  var getPieces = props.fetchPieces
  useEffect(() => {
    getPieces(token)
  }, [token])

  const moveToNewPiece = () => {
    props.history.push('/newpiece')
  }

  if (props.pieces !== null) {
    const sortedPieces = props.pieces.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    const pieceList = sortedPieces.map((piece) => (
      <tr key={piece.id}>
        <td>
          <Link data-cy="piece-link" to={`/piece/${piece.id}`}>
            {piece.title}
          </Link>
        </td>
        <td>
          <Link data-cy="piece-link" to={`/editpiece/${piece.id}`}>
            Edit
          </Link>
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
  }
}

const mapDispatchToProps = {
  fetchPieces,
}

const Pieces = withRouter(PiecesNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Pieces)
