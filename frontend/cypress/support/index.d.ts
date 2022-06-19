/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Log into a test session
     */
    login: () => Chainable<Response<{ body: { data: { username: string } } }>>;
    /**
     * Get an element using test id
     */
    getByTestId: (testId: string) => Chainable<Element>;
  }
}
