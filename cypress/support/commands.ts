/// <reference types="cypress" />

import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to generate a large file.
       * @example cy.generateLargeFile('test.pdf', 100)
       */
      generateLargeFile(fileName: string, sizeInMB: number): Chainable<File>
    }
  }
}

Cypress.Commands.add('generateLargeFile', (fileName, sizeInMB) => {
  // Creating a large string of specified size
  const blob = new Blob([new Array(sizeInMB * 1024 * 1024).fill('0').join('')], { type: 'application/pdf' });

  // Using Cypress method to turn blob into a file
  return cy.window().then(window => {
    return new window.File([blob], fileName, { type: 'application/pdf' });
  });
});

Cypress.Commands.add('forEachStep', (steps) => {
  steps.forEach(step => {
    if (step.type === 'click') {
      cy.get(step.selector).click();
    } else if (step.type === 'type') {
      cy.get(step.selector).type(step.text);
    } else if (step.type === 'assert') {
      cy.get(step.selector).should('contain', step.text);
    }
  });
});
