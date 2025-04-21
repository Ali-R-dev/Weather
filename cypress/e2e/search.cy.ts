describe('Location search flow', () => {
  beforeEach(() => {
    // Mock geocoding API response
    cy.intercept('GET', '**/geocoding-api.open-meteo.com/v1/search*', { fixture: 'geocoding_paris.json' }).as('geoSearch');
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('privacyPolicyAccepted', 'true');
      }
    });
  });

  it('shows Paris in search suggestions', () => {
    cy.get('input[aria-label="Search for a location"]').type('Paris');
    cy.wait('@geoSearch');
    cy.contains('Paris').should('be.visible');
  });

  it('selects Paris and displays header', () => {
    cy.get('input[aria-label="Search for a location"]').type('Paris');
    cy.wait('@geoSearch');
    cy.contains('Paris').click();
    cy.get('h1').contains('Paris').should('be.visible');
  });
});
