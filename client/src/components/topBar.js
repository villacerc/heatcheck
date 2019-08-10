import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import axios from 'axios'
import { navigate } from '@reach/router'

import PopperWrapper from './popperWrapper'
import { showModal, updateUser, fetchGames, fetchVenues } from '../actions'

import styles from './topBar.module.scss'

class TopBar extends React.Component {
  state = {
    showUserPopper: false
  }
  showLogin = () => {
    this.props.showModal('login')
  }
  showSignup = () => {
    this.props.showModal('signup')
  }
  toSignup = () => {
    navigate('/signup')
  }
  logOut = async () => {
    this.setState({ showUserPopper: false })

    const user = this.props.user.payload

    const confirm = async () => {
      await axios.post('api/logout')

      this.props.fetchGames()
      this.props.fetchVenues()
      this.props.updateUser()
      navigate('/')
    }

    if (user.createdGame || user.joinedGame) {
      this.props.showModal('dialog', {
        type: 'confirmation',
        body: 'This will cause you to abandon your current game. Continue?',
        confirmCallback: confirm
      })
    } else {
      confirm()
    }
  }
  renderButtons = () => {
    if (this.props.user.payload) {
      const user = this.props.user.payload
      return (
        <div ref={el => (this.userAnchor = el)}>
          <Avatar
            onClick={() => this.setState({ showUserPopper: true })}
            style={{ background: user.color, cursor: 'pointer' }}
          >
            {user.displayName.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      )
    }
    return (
      <div>
        <Button onClick={this.showLogin}>Login</Button>
        <Button onClick={this.showSignup}>Sign Up</Button>
      </div>
    )
  }
  userPopper = () => {
    const user = this.props.user.payload || {}
    return (
      <PopperWrapper
        open={this.state.showUserPopper}
        onClickAway={() => this.setState({ showUserPopper: false })}
        anchorEl={this.userAnchor}
      >
        <MenuList onClick={() => this.setState({ showUserPopper: false })}>
          <MenuItem>Profile</MenuItem>
          {(user.createdGame || user.joinedGame) && (
            <MenuItem onClick={() => navigate('/my-game')}>My Game</MenuItem>
          )}
          <MenuItem onClick={this.logOut}>Log out</MenuItem>
        </MenuList>
      </PopperWrapper>
    )
  }
  render() {
    const { user } = this.props
    return (
      <AppBar classes={{ root: styles.bar }}>
        <Toolbar>
          <div className={styles.brand}>
            <h1 onClick={() => navigate('/')}>Pick And Roll</h1>
          </div>
          {!user.fetching && this.renderButtons()}
        </Toolbar>
        {this.userPopper()}
      </AppBar>
    )
  }
}

const reduxProps = ({ user }) => {
  return {
    user
  }
}

export default connect(
  reduxProps,
  { showModal, updateUser, fetchGames, fetchVenues }
)(TopBar)
