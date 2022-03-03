import React from 'react'
import Togglable from './Togglable'
import { showInfo, showError } from '../reducers/notificationReducer'
import { createPiece } from '../reducers/piecesReducer'
import { connect } from 'react-redux'
import  { useField } from '../hooks'
import { removeReset } from '../utils'

export const NewPiece = (props) => {
  const title = useField('text')
  const artist = useField('text')
  const bpm = useField('number')
  const contents = useField('textarea')

  const pieceFormRef = React.createRef()

  const majorChords = ['C ', 'C# ', 'D ', 'D# ', 'E ', 'F ', 'F# ', 'G ', 'G# ', 'Bb ','B ','H ']
  const major7Chords = ['C7 ', 'C#7 ', 'D7 ', 'D#7 ', 'E7 ', 'F7 ', 'F#7 ', 'G7 ', 'G#7 ', 'A7 ','Bb7 ','B7 ','H7 ']
  const majormaj7Chords = ['Cmaj7 ', 'C#maj7 ', 'Dmaj7 ', 'D#maj7 ', 'Emaj7 ', 'Fmaj7 ', 'F#maj7 ', 'Gmaj7 ', 'G#maj7 ', 'Amaj7 ','Bbmaj7 ','Bmaj7 ','Hmaj7 ']
  const minorChords = ['Cm ', 'C#m ', 'Dm ', 'D#m ', 'Em ', 'Fm ', 'F#m ', 'Gm ', 'G#m ','Bbm ','Bm ']
  const minor7Chords = ['Cm7 ', 'C#m7 ', 'Dm7 ', 'D#m7 ', 'Em7 ', 'Fm7 ', 'F#m7 ', 'Gm7 ', 'G#m7 ', 'Am7 ','Bbm7 ','Bm7 ','Hm7 ']
  const minormaj7Chords = ['Cmmaj7 ', 'C#mmaj7 ', 'Dmmaj7 ', 'D#mmaj7 ', 'Emmaj7 ', 'Fmmaj7 ', 'F#mmaj7 ', 'Gmmaj7 ', 'G#mmaj7 ', 'Ammaj7 ','Bbmmaj7 ','Bmmaj7 ','Hmmaj7 ']
  const chordTest = new RegExp(
    majorChords
      .concat(major7Chords)
      .concat(major7Chords)
      .concat(majormaj7Chords)
      .concat(minorChords)
      .concat(minor7Chords)
      .concat(minormaj7Chords)
      .concat(minormaj7Chords)
      .join('|'))

  const handlePost = async (event) => {
    event.preventDefault()

    const rows = contents.value
    let page = {
      pageNumber: 1,
      rows: []
    }
    let rN = 1
    rows.split('\n').map(row => {
      // Analyze whether the row is lyrics, chords or label
      let rowType = 'Lyrics'
      if(row.indexOf('[') >= 0){
        rowType = 'Label'
      } else if(chordTest.test(row+' ')) {
        rowType = 'Chords'
      }
      page.rows.push({
        rowNumber: rN,
        rowType: rowType,
        contents: row
      })
      rN++
    })

    try {
      pieceFormRef.current.toggleVisibility()
      const newPiece = {
        title: title.value,
        artist: artist.value,
        bpm: bpm.value,
        pages: [page]
      }
      props.createPiece(newPiece, props.user.token)
      bpm.reset()
      title.reset()
      artist.reset()
      contents.reset()
      props.showInfo('added new piece', 3)
    } catch (exception) {
      console.log('exception: '+exception)
      props.showError('error in adding new piece', 3)
    }
  }

  return (
    <Togglable buttonLabel="new piece" ref={pieceFormRef}>
      <div>
        <h3>New piece</h3>
        <form onSubmit={handlePost}>
          <div className="form-group row">
            <label htmlFor="Title" className="col-sm-2 col-form-label">Title</label>
            <input className="col-sm-5" data-cy="title" {...removeReset(title)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Artist" className="col-sm-2 col-form-label">Artist</label>
            <input className="col-sm-5" data-cy="artist" {...removeReset(artist)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Bpm" className="col-sm-2 col-form-label">Bpm</label>
            <input className="col-sm-5" data-cy="bpm" {...removeReset(bpm)}/>
          </div>
          <div className="form-group row">
            <label htmlFor="Contents" className="col-sm-2 col-form-label">Contents</label>
            <textarea className="col-sm-8" data-cy="contents" {...removeReset(contents)}/>
          </div>
          <div className="form-group">
            <button type="submit" data-cy="create" className="col-sm-1 btn btn-primary">create</button>
          </div>
        </form>
      </div>
    </Togglable>
  )
}


const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = {
  createPiece, showInfo, showError
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPiece)
