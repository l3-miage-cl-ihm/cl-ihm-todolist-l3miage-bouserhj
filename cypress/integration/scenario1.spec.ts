describe('My First Test', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('L3 MIAGE')
  })

  it('No text', () => {
    cy.get('.texte').should('not.exist')
  })

  it('Checks footer absence', () => {
    //cy.get('.footer').should('not.exist')
    cy.get('app-todo-list').should('not.contain', '.footer')
  })

  it('Types something into que faire', () => {
    cy.get('.new-todo').type('abc{enter}')
  })

  it('Toggles', () => {
    cy.get('.texte').get('.toggle').click()
  })

  it('Checks footer presence', () => {
    cy.get('.footer')
  })

  it('get single result balise li', () => {
    cy.get('.todo-list').children().should('have.length', 1)
    // .todo-list <=> [class^="todo-list"]
  })

  it('single result balise li value is abc', () => {
    cy.get('.todo-list').children().should('have.length', 1)
    cy.contains('abc')
  })

  it('Adds def to list', () => {
    cy.get('.new-todo').type('def{enter}')
  })

  it('get count of balises li = 2', () => {
    cy.get('.todo-list').children().should('have.length', 2)
  })

  it('les 2 balises contiennent abc et def', () => {
    cy.get('.todo-list').children().contains('abc')
    cy.get('.todo-list').children().contains('def')
  })

  it('Toggles all 2 times to reset to initial', () => {
    cy.get('[for="toggleAll"]').click()
    cy.get('[for="toggleAll"]').click()
  })

  it('check all 2 items aren\'t done', () => {
    cy.get('.todo-count').contains(2)
  })

  it('aucune case à cocher n\'est sélectionné', () => {
    cy.get('.todo-list').children().get('.toggle').should('not.be.checked')
  })
})

/*
  impote Page de TodoList.page.ts
  cy.visit("/")
  cy.valuOf.....("").......
*/