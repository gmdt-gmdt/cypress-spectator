describe('SSN Checker app with json-server', () => {
  it('should appear as the given mockup', () => {
    // When i go to '/'
    cy.visit('/')
      // Then i should not see a status (failed or success)
      .get('[data-cy-global-status]')
      .should('not.exist')
      // And i should not see any input error
      .get('[data-cy-security-number-error]')
      .should('not.exist')
      // And i should see a form
      .get('form')
      // And i should see an input
      .get('[data-cy-security-number]')
      // And i should see a submit button
      .get('[data-cy-submit]');
  });

  it('should reject bad formatted security number', () => {
    // Given i go to '/'
    cy.visit('/');

    // When i type in a bad formatted number
    cy.get('[data-cy-security-number]').type('100 100 100');
    // And i submit the form
    cy.get('[data-cy-submit]').click();

    // Then i should see an input error
    cy.get('[data-cy-security-number-error]')
      .should('be.visible')
      .should('contain.text', 'Numéro de sécurité sociale invalide !');

    // And i should see a global failing message
    cy.get('[data-cy-global-status]')
      .should('contain.text', 'Le patient ne peut pas être pris en charge !')
      .should('have.class', 'alert-danger');
  });

  it('should reject false security number', () => {
    // Http setup to stub a failing API response
    cy.intercept('http://localhost:3000/ssn/186103013999001', {
      statusCode: 404,
    });

    // Given i go to '/'
    cy.visit('/');

    // When i type in a well formatted but false number
    cy.get('[data-cy-security-number]').type('186103013999001');
    // And i submit the form
    cy.get('[data-cy-submit]').click();

    // Then i should see an input error
    cy.get('[data-cy-security-number-error]').should(
      'contain.text',
      'Numéro de sécurité sociale invalide !'
    );

    // And i should see a global failing message
    cy.get('[data-cy-global-status]')
      .should('contain.text', 'Le patient ne peut pas être pris en charge !')
      .should('have.class', 'alert-danger');
  });

  it('should accept a valid security number', () => {
    // Http setup to stub a successful API response
    cy.intercept('http://localhost:3000/ssn/186103013055001', {
      statusCode: 200,
    });

    // Given i go to '/'
    cy.visit('/');

    // When i type in a valid number
    cy.get('[data-cy-security-number]').type('186103013055001');
    // And i submit the form
    cy.get('[data-cy-submit]').click();

    // Then i should not see any input error
    cy.get('[data-cy-security-number-error]').should('not.exist');
    // And i should see a success global message
    cy.get('[data-cy-global-status]')
      .should('contain.text', 'Le patient est pris en charge !')
      .should('have.class', 'alert-success');
  });
});
