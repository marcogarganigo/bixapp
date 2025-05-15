import React from 'react'
import LoadingComp from './loading'

describe('<LoadingComp />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LoadingComp />)
  })
})