import React, { Component } from 'react'
import { Router } from '@reach/router'
import { connect } from 'react-redux'

import { fetchUser } from './actions'
import TopBar from './extra/TopBar'
import Landing from './views/landing'
import ModalConductor from './modals'
import Signup from './views/signup'

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }
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

export default connect(
  null,
  { fetchUser }
)(App)
