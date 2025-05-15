import React from 'react';
import QuickFilters from './quickFilters';
import { useRecordsStore } from '@/utils/stores/store';

describe('<QuickFilters />', () => {
  let mockSetSearchTerm: Cypress.Agent<any>;
  let mockSetTableView: Cypress.Agent<any>;
  let mockSetRefreshTable: Cypress.Agent<any>;

  beforeEach(() => {
    mockSetSearchTerm = cy.stub().as('setSearchTerm');
    mockSetTableView = cy.stub().as('setTableView');
    mockSetRefreshTable = cy.stub().as('setRefreshTable');

    cy.stub(useRecordsStore, 'useRecordsStore').returns({
      setSearchTerm: mockSetSearchTerm,
      setTableView: mockSetTableView,
      setRefreshTable: mockSetRefreshTable,
      refreshTable: 0,
      selectedMenu: 1
    });
  });

  it('renders without crashing', () => {
    cy.mount(<QuickFilters />);
    cy.get('select#filter-type').should('exist');
    cy.get('input#default-search').should('exist');
  });

  it('updates input and triggers setSearchTerm', () => {
    cy.mount(<QuickFilters />);
    cy.get('input#default-search')
      .type('prova')
      .should('have.value', 'prova')
      .then(() => {
        expect(mockSetSearchTerm).to.have.been.calledWith('prova');
      });
  });

  it('changes view and triggers setTableView', () => {
    cy.mount(<QuickFilters />);
    cy.get('select#filter-type')
      .select('2') // assicurati che il valore 2 esista nei dati DEV
      .then(() => {
        expect(mockSetTableView).to.have.been.calledWith('2');
      });
  });

  it('submits and triggers table refresh', () => {
    cy.mount(<QuickFilters />);
    cy.get('form').submit().then(() => {
      expect(mockSetRefreshTable).to.have.been.called;
    });
  });
});
