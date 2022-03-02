import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup  } from '@testing-library/react'
import SimplePiece from './SimplePiece'

afterEach(cleanup)

test('SimplePiece renders content', () => {
  const piece = {
    title: 'Whiter Shade of Pale',
    author: 'Procol Harum',
    bpm: 80
  }

  const component = render(
    <SimplePiece piece={piece} />
  )

  const titleAndArtist = component.container.querySelector('.simplePiece .titleAndArtist')
  //console.log(prettyDOM(titleAndArtist))
  expect(titleAndArtist).toHaveTextContent(
    'Whiter Shade of Pale by Procol Harum'
  )
  const likes = component.container.querySelector('.simplePiece .bpm')
  //console.log(prettyDOM(likes))
  expect(likes).toHaveTextContent(
    'Play at 80 bpm'
  )
})