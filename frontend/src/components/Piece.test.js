/**
 * @jest-environment jsdom
 */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup } from '@testing-library/react'
import { PieceNoHistory as Piece } from './Piece'

describe('<Piece />', () => {
  let component

  const mockHandler1 = jest.fn()
  const mockHandler2 = jest.fn()
  const mockHandler3 = jest.fn()
  const mockHandler4 = jest.fn()
  const mockHandler5 = jest.fn()
  const mockHandler6 = jest.fn()

  beforeEach(() => {
    let band = {
      name: 'Kyarhem',
      username: 'kyarhem',
      token: '438765436298',
    }
    let piece = {
      id: '432342',
      title: 'Knocking on Heavens Door',
      artist: 'Bob Dylan',
      duration: '150',
      delay: '35',
      pages: [
        {
          id: '32344',
          rows: [
            {
              id: '43434321',
              rowNumber: 1,
              rowType: 'Chords',
              contents: 'G D Am',
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
        band={band}
        showInfo={mockHandler1}
        showError={mockHandler2}
        deletePiece={mockHandler3}
        fetchPiece={mockHandler4}
        transposeUp={mockHandler5}
        transposeDown={mockHandler6}
      />
    )
  })

  afterEach(cleanup)

  test('renders its contents', () => {
    component.container.querySelector('.piece')
  })

  test('all piece details are displayed', () => {
    const div = component.container.querySelector('.piece')
    expect(div).toHaveTextContent('Knocking on Heavens Door by Bob Dylan')
    expect(div).toHaveTextContent('Piece length 150 seconds')
    expect(div).toHaveTextContent('Delay before start of scroll 35 seconds')
    expect(div).toHaveTextContent('G D Am')
    expect(div).toHaveTextContent('Mama take this badge off of me')
  })
})
