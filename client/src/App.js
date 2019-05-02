import React, { Component } from 'react'
import { Router } from '@reach/router'

import TopBar from './extra/TopBar'
import Landing from './views/landing'
import ModalConductor from './modals'
import Signup from './views/signup'

class App extends Component {
  render() {
    return (
      <div>
        <ModalConductor />
        <TopBar />
        <div className="app-body">
          <Router>
            <Landing path="/" />
            <Signup path="signup" />
          </Router>
        </div>
      </div>
    )
  }
}

export default App
