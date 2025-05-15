import React from 'react'
import RecordCard from './mainBody'

describe('<RecordCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RecordCard />)
  })
})