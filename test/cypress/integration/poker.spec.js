describe('Romanian poker', () => {
  it('Open poker game', () => {
    cy.visit('/');

    cy.get('#scoreboard').should('contain', 'Duh sa sekirom').and('contain', '31');

    cy.get('section.cards').should('have.length', 7);

    cy.get('[tag="0"]').click();

    cy.get('section.cards').should('have.length', 8);

    cy.get('[tag="4"]').click();

    cy.get('section.cards').should('have.length', 9);

    cy.get('#restart').click();

    cy.get('section.cards').should('have.length', 7);
  });
});
