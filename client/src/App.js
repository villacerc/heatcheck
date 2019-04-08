import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

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
        <Switch>
          <Route exact path="/" render={props => <Landing {...props} />} />
          <Route path="/signup" render={props => <Signup {...props} />} />
        </Switch>
      </div>
    )
  }
}

export default App
