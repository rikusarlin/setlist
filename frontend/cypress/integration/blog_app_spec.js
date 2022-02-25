/* eslint-disable no-undef */
describe('Blog ', function() {
  const user = {
    name: 'Leo Sarlin',
    username: 'leosarlin',
    password: 'leosarlin'
  }

  const blog = {
    title: 'Making Errors Is Loads Of Fun',
    author: 'Riku Sarlin',
    url: 'https://www.kela.fi/blogs/making_errors.html'
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blog app')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.get('[data-cy=username]')
        .type(user.username)
      cy.get('[data-cy=password]')
        .type(user.password)
      cy.get('[data-cy=login]')
        .click()
    })

    it('name of the logged in user is displayed', function() {
      cy.contains('Leo Sarlin logged in')
    })

    it('no blogs are initially displayed', function() {
      cy.contains(blog.title).should('not.exist')
    })

    it('a new blog can be inserted', function() {
      cy.get('[data-cy="new blog"]')
        .click()
      cy.get('[data-cy=title]')
        .type(blog.title)
      cy.get('[data-cy=author]')
        .type(blog.author)
      cy.get('[data-cy=url]')
        .type(blog.url)
      cy.get('[data-cy=create]')
        .click()
      cy.contains(blog.title)
    })
  })

  describe('when logged in and a blog inserted', function () {
    beforeEach(function () {
      cy.get('[data-cy=username]')
        .type(user.username)
      cy.get('[data-cy=password]')
        .type(user.password)
      cy.get('[data-cy=login]')
        .click()
      cy.get('[data-cy="new blog"]')
        .click()
      cy.get('[data-cy=title]')
        .type(blog.title)
      cy.get('[data-cy=author]')
        .type(blog.author)
      cy.get('[data-cy=url]')
        .type(blog.url)
      cy.get('[data-cy=create]')
        .click()
    })

    it('blog details can be opened and details are shown', function() {
      cy.get('[data-cy=blog-link]').first().click()
      cy.contains(blog.title)
      cy.contains(blog.author)
      cy.contains(blog.url)
      cy.contains('0 likes')
      cy.contains('added by '+user.name)
    })

    it('an opened blog can be liked', function() {
      cy.get('[data-cy=blog-link]').first().click()
      cy.contains('0 likes')
      cy.get('[data-cy=like]')
        .click()
      cy.contains('1 likes')
    })

  })

})
