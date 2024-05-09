import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import axios from 'axios'
import { navigate, Link } from '@reach/router'
import Badge from '@material-ui/core/Badge'
import classNames from 'classnames'

import PopperWrapper from './popperWrapper'
import {
  showModal,
  updateUser,
  fetchGames,
  fetchVenues,
  setSelectedVenue
} from '../actions'

import styles from './topBar.module.scss'

class TopBar extends React.Component {
  state = {
    userAnchorEl: null,
    showUserPopper: false,
    isSmall: false
  }
  componentDidMount() {
    if (window.innerWidth <= 500) {
      this.setState({ isSmall: true })
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 500 && !this.state.isSmall) {
        this.setState({ isSmall: true })
      } else if (window.innerWidth > 500 && this.state.isSmall) {
        this.setState({ isSmall: false })
      }
    })
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

      // this.props.fetchGames()
      // this.props.fetchVenues()
      await this.props.updateUser()
      navigate('/signed-out')
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
  avatarClick = e => {
    this.setState({ userAnchorEl: e.currentTarget })
  }
  renderButtons = () => {
    if (this.props.user.payload) return this.renderAvatar()

    const inSearch = this.props.location.pathname === "/"

    return (
      <div
        className={classNames(
          styles.buttons,
          inSearch ? styles.invertedButtons : ''
        )}
        style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}
      >
        {this.renderNavItems()}
        <Button onClick={this.showLogin}>Login</Button>
        <Button
          variant="outlined"
          style={{ marginLeft: '.5rem', borderColor: 'white' }}
          onClick={this.showSignup}
        >
          Sign Up
        </Button>
      </div>
    )
  }
  renderNavItems = () => {

    const inSearch = this.props.location.pathname === "/"
    const inCourts = this.props.location.pathname === "/venues"

    return (
      <div
        style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}
      >
        {!inSearch && <Button onClick={() => navigate('/')}>
          <i style={{ fontSize: '17pt' }} className="fas fa-search"></i>
        </Button>}
        {!inCourts && !inSearch && <Button onClick={()=>navigate("/venues")}>Courts</Button>}
      </div>
    )
  }
  renderAvatar = () => {
    const user = this.props.user.payload

    const avatar = () => {
      return (
        <div
          ref={el => (this.userAnchor = el)}
          style={{ marginLeft: 'auto', display: 'flex' }}
        >
          {this.renderNavItems()}
          <Avatar
            onClick={this.avatarClick}
            style={{ background: user.color, cursor: 'pointer' }}
          >
            {user.displayName.charAt(0).toUpperCase()}
          </Avatar>
        </div>
      )
    }

    if (user && user.gameInvites[0]) {
      return (
        <Badge className={styles.badge} color="primary">
          {avatar()}
        </Badge>
      )
    }

    return avatar()
  }
  userPopper = () => {
    const user = this.props.user.payload
    return (
      <PopperWrapper
        open={Boolean(this.state.userAnchorEl)}
        onClose={() => this.setState({ userAnchorEl: null })}
        anchorEl={this.userAnchor}
      >
        <MenuList onClick={() => this.setState({ userAnchorEl: null })}>
          {(user.createdGame || user.joinedGame) && (
            <MenuItem onClick={() => navigate('/my-game')}>My Game</MenuItem>
          )}
          {user.gameInvites[0] && (
            <MenuItem
              onClick={() =>
                this.props.showModal('game requests', { type: 'invites' })
              }
            >
              Game Invites
              <span className={styles.inlineBadge}>
                {user.gameInvites.length}
              </span>
            </MenuItem>
          )}
          <MenuItem onClick={this.logOut}>Log out</MenuItem>
        </MenuList>
      </PopperWrapper>
    )
  }
  render() {
    const { user, location } = this.props

    const inSearch = location.pathname === "/"

    return (
      <div onTouchStart={() => this.props.setSelectedVenue({})}>
        <AppBar
          classes={{
            root: inSearch ? styles.barTransparent : styles.bar
          }}
        >
          <Toolbar>
            {!inSearch && (
              <div className={styles.brand}>
                <h1 onClick={() => navigate('/')}>
                  {this.state.isSmall ? 'P' : 'Pick and Roll'}
                </h1>
              </div>
            )}
            {!user.fetching && this.renderButtons()}
          </Toolbar>
          {user.payload && this.userPopper()}
        </AppBar>
      </div>
    )
  }
}

const reduxProps = ({ user }) => {
  return {
    user
  }
}

export default connect(reduxProps, {
  showModal,
  updateUser,
  fetchGames,
  fetchVenues,
  setSelectedVenue
})(TopBar)
