import React, { Component } from 'react'

import Landing from './views/landing/Landing'
import ModalConductor from './modals/ModalConductor'

class App extends Component {
  render() {
    return (
      <div>
        <ModalConductor />
        <Landing />
      </div>
    )
  }
}

export default App
