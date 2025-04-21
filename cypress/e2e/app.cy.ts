describe('Home Page', () => {
  it('loads without errors', () => {
    cy.visit('/');
    cy.get('div.min-h-screen').should('be.visible');
    cy.contains('AR');
  });
});
