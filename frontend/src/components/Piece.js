import React, { useEffect } from 'react'
import { showInfo, showError } from '../reducers/notificationReducer'
import { deletePiece, fetchPiece } from '../reducers/piecesReducer'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Table } from 'react-bootstrap'

export const PieceNoHistory = (props)  => {
  var token=props.user.token
  var getPiece = props.fetchPieces
  useEffect(() => {
    getPiece(token)
  }, [token, getPiece])

  if ( props.piece === undefined || props.piece === null){
    return <div/>
  }

  const handleDelete = async () => {
    try {
      props.deletePiece(props.piece.id, props.user.token)
      props.showInfo('piece deleted', 3)
      props.history.push('/pieces')
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in deleting piece', 3)
    }
  }

  const confirmDelete = () => {
    if(window.confirm(`remove piece ${props.piece.title} by ${props.piece.atist}?`)){
      handleDelete()
    }

  }

  if(props.user.username !== null){

    let deletePiece = <button className="btn btn-danger" type="button" onClick={confirmDelete}>delete</button>

    const rowList = props.piece.pages.map(page =>
      page.rows.map(row => {
        if (row.type === 'Label'){
          return (<tr key={row.id} className="label"><td>{row.contents}</td></tr>)
        } else if (row.type === 'Chords'){
          return (<tr key={row.id} className="chords"><td>{row.contents}</td></tr>)
        } else {
          return (<tr key={row.id} className="lyrics"><td>{row.contents}</td></tr>)
        }
      })
    )

    return(
      <div className="piece">
        <div>
          <h2>{props.piece.title} by {props.piece.author}</h2>
          Played at {props.piece.bpm} bpm <br/>
          <Table>
            <tbody>
              {rowList}
            </tbody>
          </Table>
          {deletePiece}<br/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    piece: state.piece
  }
}

const mapDispatchToProps = {
  showInfo, showError, deletePiece, fetchPiece
}

const Piece = withRouter(PieceNoHistory)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Piece)
