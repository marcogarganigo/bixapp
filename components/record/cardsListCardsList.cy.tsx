import React from 'react'
import CardsList from './cardsList'

describe('<CardsList />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardsList />)
  })
})