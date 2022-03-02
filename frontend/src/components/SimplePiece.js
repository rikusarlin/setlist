import React from 'react'

const SimplePiece = ({ piece }) => (
  <div className='simplePiece'>
    <div className='titleAndArtist'>
      {piece.title} by {piece.artist}
    </div>
    <div className='bpm'>
      Play at {piece.bpm} bpm
    </div>
  </div>
)

export default SimplePiece