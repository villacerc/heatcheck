import React, { Component } from 'react'
import { Router, Location } from '@reach/router'
import { connect } from 'react-redux'

import { fetchUser } from './actions'
import TopBar from './components/topBar'
import Landing from './pages/landing'
import Game from './pages/game'
import ModalConductor from './modals'

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }
  render() {
    return (
      <div>
        <Location>{props => <ModalConductor {...props} />}</Location>
        <TopBar />
        <div className="app-body">
          <Router>
            <Landing path="/" />
            <Game path="/game" />
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
