describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://138.197.36.40:3000')

    cy.get('input[type="email"]').type('charan@gmail.com');
    cy.get('input[type="password"]').type('1234');

    // Click the sign-in button
    cy.get('button[type="submit"]').click();

    // Assert that the user is redirected to the home page or another expected page
    cy.url().should('eq', 'http://138.197.36.40:3000/');

  })
})