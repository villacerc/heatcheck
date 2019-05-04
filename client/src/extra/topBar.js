import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import axios from 'axios'

import PopperWrapper from './popperWrapper'
import { showModal, updateUser } from '../actions'

import styles from './topBar.module.scss'

class TopBar extends React.Component {
  state = {
    showUserPopper: false
  }
  showLogin = () => {
    this.props.showModal('login')
  }
  toSignup = () => {
    this.props.history.push('/signup')
  }
  logOut = async () => {
    const res = await axios.get('api/logout')

    this.props.updateUser(res.data.user)
    this.setState({ showUserPopper: false })
  }
  renderButtons = () => {
    if (this.props.user.payload) {
      return (
        <div ref={el => (this.userAnchor = el)}>
          <Icon
            onClick={() => this.setState({ showUserPopper: true })}
            className={styles.defaultAv}
          >
            account_circle
          </Icon>
        </div>
      )
    }
    return <Button onClick={this.showLogin}>Login</Button>
  }
  userPopper = () => {
    return (
      <PopperWrapper
        open={this.state.showUserPopper}
        onClickAway={() => this.setState({ showUserPopper: false })}
        anchorEl={this.userAnchor}
      >
        <MenuList>
          <MenuItem>Profile</MenuItem>
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
            <h1>Heat Check</h1>
          </div>
          {user.fetching ? null : this.renderButtons()}
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
  { showModal, updateUser }
)(TopBar)
