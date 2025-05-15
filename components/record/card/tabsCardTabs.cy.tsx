import React from 'react'
import CardTabs from './tabs'

describe('<CardTabs />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CardTabs />)
  })
})