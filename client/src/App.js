import React, { Component } from 'react'
import { Router, Location } from '@reach/router'
import { connect } from 'react-redux'

import { fetchUser } from './actions'
import TopBar from './components/topBar'
import Landing from './pages/landing'
import Game from './pages/game'
import Venue from './pages/venue'
import SignedOut from './pages/signedOut'
import NotFound from './pages/notFound'
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
            <Game path="/my-game" />
            <Game path="/games/:gameId" />
            <Venue path="/venues/:venueId" />
            <SignedOut path="/signed-out" />
            <NotFound default />
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
