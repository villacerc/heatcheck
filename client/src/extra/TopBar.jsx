import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import { showModal } from '../actions'

import styles from './TopBar.module.scss'

class TopBar extends React.Component {
  showLogin = () => {
    this.props.showModal('login')
  }
  toSignup = () => {
    this.props.history.push('/signup')
  }
  render() {
    return (
      <AppBar classes={{ root: styles.bar }}>
        <Toolbar>
          <div className={styles.brand}>
            <h1>Heat Check</h1>
          </div>
          <Button onClick={this.showLogin}>Login</Button>
        </Toolbar>
      </AppBar>
    )
  }
}

export default connect(
  null,
  { showModal }
)(TopBar)
