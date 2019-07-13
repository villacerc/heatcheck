import React, { Component } from 'react'
import { Router, Location } from '@reach/router'
import { connect } from 'react-redux'

import { fetchUser } from './actions'
import TopBar from './components/topBar'
import Landing from './pages/landing'
import Game from './pages/game'
import NotFound from './pages/notFound'
import ModalConductor from './modals'

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }
  render() {
    if (this.props.user.fetching) return null

    return (
      <div>
        <Location>{props => <ModalConductor {...props} />}</Location>
        <TopBar />
        <div className="app-body">
          <Router>
            <Landing path="/" />
            <Game path="/game" />
            <NotFound default />
          </Router>
        </div>
      </div>
    )
  }
}

const reduxState = ({ user }) => {
  return { user }
}

export default connect(
  reduxState,
  { fetchUser }
)(App)
