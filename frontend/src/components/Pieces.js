import React, { useEffect } from 'react'
import { fetchPieces } from '../reducers/piecesReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

export const Pieces = (props) => {
  var token=props.user.token
  var getPieces = props.fetchPieces
  useEffect(() => {
    getPieces(token)
  }, [token, getPieces])

  if(props.pieces !== null){
    const sortedPieces = props.pieces.sort((a,b) => a.title.localeCompare(b.title) )
    const pieceList = sortedPieces.map(piece =>
      <tr key={piece.id}>
        <td>
          <Link data-cy="piece-link" to={`/pieces/${piece.id}`}>{piece.title}</Link>
        </td>
      </tr>
    )

    if(props.user.user !== null){
      return(
        <Table striped>
          <tbody>
            {pieceList}
          </tbody>
        </Table>
      )
    }
  }
  return(<div/>)
}


const mapStateToProps = (state) => {
  return {
    pieces: state.pieces,
    user: state.user
  }
}

const mapDispatchToProps = {
  fetchPieces
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pieces)
