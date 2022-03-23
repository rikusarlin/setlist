import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup } from '@testing-library/react'
import { PieceNoHistory as Piece } from './Piece'

describe('<Piece />', () => {
  let component

  const mockHandler1 = jest.fn()
  const mockHandler2 = jest.fn()
  const mockHandler4 = jest.fn()

  beforeEach(() => {
    let user = {
      name: 'Riku Sarlin',
      username: 'rikusarlin',
      token: '438765436298',
    }
    let piece = {
      id: '432342',
      title: 'Knocking on Heavens Door',
      artist: 'Bob Dylan',
      bpm: '60',
      pages: [
        {
          id: '32344',
          rows: [
            {
              id: '43434321',
              rowNumber: 1,
              rowType: 'Chords',
              contents: 'G              D            Am',
            },
            {
              id: '987438',
              rowNumber: 2,
              rowType: 'Lyrics',
              contents: 'Mama take this badge off of me',
            },
          ],
        },
      ],
    }
    component = render(
      <Piece
        piece={piece}
        user={user}
        showInfo={mockHandler1}
        showError={mockHandler2}
        deletePiece={mockHandler4}
      />
    )
  })

  afterEach(cleanup)

  test('renders its contents', () => {
    component.container.querySelector('.piece')
  })

  test('all piece details are displayed', () => {
    const div = component.container.querySelector('.piece')
    expect(div).toHaveTextContent('Knocking on Heavens Door')
    expect(div).toHaveTextContent('Bob Dylan')
    expect(div).toHaveTextContent('Play at 80 bpm')
    expect(div).toHaveTextContent('G              D            Am')
    expect(div).toHaveTextContent('Mama take this badge off of me')
  })
})
