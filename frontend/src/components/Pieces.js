import React, { useEffect } from 'react'
import { fetchPieces } from '../reducers/piecesReducer'
import { clearAnalysis } from '../reducers/analyzeReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

export const PiecesNoHistory = (props) => {
  var token=props.user.token
  var getPieces = props.fetchPieces
  useEffect(() => {
    getPieces(props.id, token)
  }, [token, getPieces])

  const moveToNewPiece = () => {
    props.clearAnalysis()
    props.history.push('/newpiece')
  }

  if(props.pieces !== null){
    const sortedPieces = props.pieces.sort((a,b) => a.title.localeCompare(b.title) )
    const pieceList = sortedPieces.map(piece =>
      <tr key={piece.id}>
        <td>
          <Link data-cy="piece-link" to={`/piece/${piece.id}`}>{piece.title}</Link>
        </td>
      </tr>
    )

    if(props.user.user !== null){
      return(
        <div>
          <button onClick={moveToNewPiece} data-cy="new-piece" className="btn btn-primary">New piece</button>
          <Table striped>
            <tbody>
              {pieceList}
            </tbody>
          </Table>
        </div>
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
  fetchPieces,
  clearAnalysis
}

const Pieces = withRouter(PiecesNoHistory)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pieces)
