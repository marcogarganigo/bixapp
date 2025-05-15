import React from 'react'
import Sidebar from './sidebar'

describe('<Sidebar />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Sidebar />)
  })
})