import React, { Component } from 'react'
import { Router } from '@reach/router'
import { connect } from 'react-redux'

import { fetchUser } from './actions'
import TopBar from './components/topBar'
import Landing from './pages/landing'
import ModalConductor from './modals'

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
