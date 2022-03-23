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
        props.addPieceToSetlist(setlistId, pieceId, props.band.token)
        props.showInfo('added piece to setlist', 3)
      }
    } catch (exception) {
      console.log('exception: ' + exception)
      props.showError('error in adding piece to setlist', 3)
    }
  }

  if (props.pieces !== null) {
    const sortedPieces = props.pieces.sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    const sortedSetlists = props.setlists.sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    const chooseOne = [
      {
        id: 'choose',
        name: '(Choose)',
      },
    ]
    const sortedSetlists2 = chooseOne.concat(sortedSetlists)

    const setListOptions = sortedSetlists2.map((setlist) => {
      const retVal = (
        <option key={setlist.id} value={setlist.id}>
          {setlist.name}
        </option>
      )
      return retVal
    })
    const pieceList = sortedPieces.map((piece) => (
      <div key={piece.id} className="row">
        <div className="col-sm-4">
          <Link data-cy="piece-link" to={`/piece/${piece.id}`}>
            {piece.title}
          </Link>
        </div>
        <div className="col-sm-1">
          <Link data-cy="piece-link" to={`/editpiece/${piece.id}`}>
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
            className="mr-2 btn btn-primary"
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
          <div className="container">{pieceList}</div>
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
  fetchSetlists,
  showInfo,
  showError,
}

const Pieces = withRouter(PiecesNoHistory)

export default connect(mapStateToProps, mapDispatchToProps)(Pieces)
