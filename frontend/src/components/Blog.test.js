import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup } from '@testing-library/react'
import { BlogNoHistory as Blog } from './Blog'


describe('<Blog />', () => {
  let component

  const mockHandler1 = jest.fn()
  const mockHandler2 = jest.fn()
  const mockHandler3 = jest.fn()
  const mockHandler4 = jest.fn()
  const mockHandler5 = jest.fn()

  beforeEach(() => {
    let user = {
      name: 'Riku Sarlin',
      username: 'rikusarlin',
      token: '438765436298'
    }
    let blog = {
      id: '432342',
      title: 'Blog title',
      author: 'John Author',
      likes: '12',
      url: 'http://www.kela.fi/jokin/osoite.html',
      user: {
        name: 'Riku Sarlin',
        username: 'rikusarlin',
        token: '438765436298'
      },
      comments: ['Kommentti 1','Kommentti 2']
    }
    component = render(
      <Blog
        blog={blog}
        user={user}
        showInfo={mockHandler1}
        showError={mockHandler2}
        likeBlog={mockHandler3}
        deleteBlog={mockHandler4}
        commentBlog={mockHandler5}
      />
    )
  })

  afterEach(cleanup)

  test('renders its contents', () => {
    component.container.querySelector('.blog')
  })

  test('all blog details are displayed', () => {
    const div = component.container.querySelector('.blog')
    // console.log(prettyDOM(div))
    expect(div).toHaveTextContent('Blog title')
    expect(div).toHaveTextContent('John Author')
    expect(div).toHaveTextContent('added by Riku Sarlin')
    expect(div).toHaveTextContent('12 likes')
    expect(div).toHaveTextContent('http://www.kela.fi/jokin/osoite.html')
  })

})