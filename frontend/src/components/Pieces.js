import React, { useEffect, useState } from 'react'
import { fetchPieces } from '../reducers/piecesReducer'
import { fetchSetlists, addPieceToSetlist } from '../reducers/setlistReducer'
import { showInfo, showError } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'

export const PiecesNoHistory = (props) => {
  const [selectedSetlist, setSelectedSetlist] = useState('choose')
  useEffect(() => {
    const fetchData = async () => {
      await props.fetchPieces(props.band.token)
      await props.fetchSetlists(props.band.token)
    }
    fetchData()
  }, [props.band.token])

  const moveToNewPiece = () => {
    props.history.push('/newpiece')
  }

  const handleAdd = async (setlistId, pieceId) => {
    try {
      console.log(`addToSetList, setlistId: ${setlistId}, pieceId: ${pieceId}`)
      if (setlistId !== 'choose') {
        await props.addPieceToSetlist(setlistId, pieceId, props.band.token)
        props.showInfo('added piece to setlist', 3)
      }
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in adding piece to setlist', 3)
    }
  }

  if (props.pieces !== null) {
    var setLists = [
      {
        id: 'choose',
        name: '(Choose)',
      },
    ]
    if (props.setlists !== null) {
      setLists = setLists.concat(props.setlists)
    }
    const setListOptions = setLists.map((setlist, index) => (
      <option key={index} value={setlist.id}>
        {setlist.name}
      </option>
    ))
    const pieceList = props.pieces.map((piece, index) => (
      <div key={index} className="row">
        <div className="col-sm-4">
          <Link data-cy="piece-link" to={`/piece/${piece.id}`}>
            {piece.title}
          </Link>
        </div>
        <div className="col-sm-2">
          <Link
            className="mr-2 py-0 btn btn-primary white-color"
            data-cy="piece-link"
            to={`/editpiece/${piece.id}`}
          >
            Edit
          </Link>
        </div>
        <div className="col-sm-6">
          <select
            value={selectedSetlist.value}
            data-cy="cy_id_setlist"
            name="setlist"
            onChange={(e) => {
              console.log('Changing selected setlist to: ' + e.target.value)
              setSelectedSetlist(e.target.value)
            }}
          >
            {setListOptions}
          </select>
          <button
            type="basic"
            data-cy="add_to_setlist"
            value={piece.id}
            className="ml-2 py-0 btn btn-primary"
            onClick={(e) => {
              handleAdd(selectedSetlist, e.target.value)
            }}
          >
            add to setlist
          </button>
        </div>
      </div>
    ))

    if (props.band.username !== null) {
      return (
        <div>
          <div className="container striped">{pieceList}</div>
          <button
            onClick={moveToNewPiece}
            data-cy="new-piece"
            className="btn btn-primary py-0"
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
  fetchSetlists,
  showInfo,
  showError,
}

const Pieces = withRouter(PiecesNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Pieces)
