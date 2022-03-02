/* eslint-disable no-undef */
describe('Piece ', function() {
  const user = {
    name: 'Riku Sarlin',
    username: 'riku',
    password: 'riku'
  }

  const piece = {
    title: 'Knocking on Heavens Door',
    artist: 'Bob Dylan',
    bpm: 80
  }

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Setlist app')
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
      cy.contains('Riku Sarlin logged in')
    })

    it('no pieces are initially displayed', function() {
      cy.contains(piece.title).should('not.exist')
    })

    it('a new piece can be inserted', function() {
      cy.get('[data-cy="new piece"]')
        .click()
      cy.get('[data-cy=title]')
        .type(piece.title)
      cy.get('[data-cy=artist]')
        .type(piece.artist)
      cy.get('[data-cy=bpm]')
        .type(piece.bpm)
      cy.get('[data-cy=create]')
        .click()
      cy.contains(piece.title)
    })
  })

  describe('when logged in and a piece inserted', function () {
    beforeEach(function () {
      cy.get('[data-cy=username]')
        .type(user.username)
      cy.get('[data-cy=password]')
        .type(user.password)
      cy.get('[data-cy=login]')
        .click()
      cy.get('[data-cy="new piece"]')
        .click()
      cy.get('[data-cy=title]')
        .type(piece.title)
      cy.get('[data-cy=artist]')
        .type(piece.artist)
      cy.get('[data-cy=bpm]')
        .type(piece.bpm)
      cy.get('[data-cy=create]')
        .click()
    })

    it('piece details can be opened and details are shown', function() {
      cy.get('[data-cy=piece-link]').first().click()
      cy.contains(piece.title)
      cy.contains(piece.author)
      cy.contains(piece.bpm)
    })

  })

})
