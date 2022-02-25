import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('SimpleBlog renders content', () => {
  const blog = {
    title: 'Title of Blog',
    author: 'John Author',
    likes: 11
  }

  const component = render(
    <SimpleBlog blog={blog} />
  )

  const titleAndAuthor = component.container.querySelector('.simpleBlog .titleAndAuthor')
  //console.log(prettyDOM(titleAndAuthor))
  expect(titleAndAuthor).toHaveTextContent(
    'Title of Blog by John Author'
  )
  const likes = component.container.querySelector('.simpleBlog .likes')
  //console.log(prettyDOM(likes))
  expect(likes).toHaveTextContent(
    '11'
  )
})

test('clicking the button calls event handler once', async () => {
  const blog = {
    title: 'Title of Blog',
    author: 'John Author',
    likes: 11
  }
  const mockHandler = jest.fn()

  const component = render(
    <SimpleBlog blog={blog} onClick={mockHandler} />
  )

  const button = component.container.querySelector('.simpleBlog .likes .button')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})