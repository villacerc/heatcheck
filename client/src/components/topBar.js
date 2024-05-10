import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import axios from '../services/axios'
import { navigate } from '@reach/router'
import Badge from '@material-ui/core/Badge'
import Drawer from '@material-ui/core/Drawer'

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
    showDrawer: false,
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
  hideDrawer = () => {
    this.setState({showDrawer: false})
  }
  showLogin = () => {
    this.hideDrawer()
    this.props.showModal('login')
  }
  showSignup = () => {
    this.hideDrawer()
    this.props.showModal('signup')
  }
  toSignup = () => {
    navigate('/signup')
  }
  logOut = async () => {
    this.setState({ showUserPopper: false })

    const user = this.props.user.payload

    const confirm = async () => {
      await axios.post('/api/logout')

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
  renderLogin = () => {
    if (this.props.user.payload) return

    return (
      <Button onClick={this.showLogin}>Login</Button>
    )
  }
  renderSignup = () => {
    if (this.props.user.payload) return

    return (
      <Button onClick={this.showSignup}>Sign Up</Button>
    )
  }
  renderCloseButton = () => {
    return (
      <div className={styles.closeIconContainer}>
      <Button onClick={()=>this.setState({showDrawer: false})}>
      <i class="fas fa-times"></i>
      </Button>
    </div>
    )
  }
  goToVenuesPage = () => {
    this.hideDrawer()
    navigate('/venues')
  }
  renderCourtsButton = () => {
    const inCourts = this.props.location.pathname === "/venues"
    const inSearch = this.props.location.pathname === "/"

    if(inCourts || inSearch) return

    return (
      <Button onClick={this.goToVenuesPage}>Courts</Button>
    )
  }
  goToSearchPage = () => {
    this.hideDrawer()
    navigate('/')
  }
  renderSearchButton = () => {
    const inSearch = this.props.location.pathname === "/"

    if(inSearch) return

    return (
      <Button onClick={this.goToSearchPage}>
        <i style={{ fontSize: '17pt' }} className="fas fa-search"></i>
      </Button>
    )
  }
  renderNavItems = () => {
    return (
      <div className={styles.navItems}>
        {this.renderCloseButton()}
        {this.renderSearchButton()}
        {this.renderCourtsButton()}
        {this.renderLogin()}
        {this.renderSignup()}
      </div>
    )
  }
  renderFixedNav = () => {
    return (
      <div className={styles.fixedNav}>
        {this.renderNavItems()}
      </div>
    )
  }
  renderNav = () => {
    const { user } = this.props

    if(user.fetching) return

    return (
      <div>
        {this.renderNavDrawer()}
        {this.renderFixedNav()}
      </div>
    )
  }
  renderNavBurger = () => {
    return (
      <Button 
        onClick={()=>this.setState({showDrawer: true})}
        className={styles.navBurger}>
        <i className="fas fa-bars"></i>
      </Button>
    )
  }
  renderNavDrawer = () => {
    return (
      <Drawer
      open={this.state.showDrawer} 
      className={styles.drawer}
      anchor="top"
      >
        {this.renderNavItems()}
      </Drawer>
    )
  }
  renderAvatar = () => {
    const user = this.props.user.payload

    if(!user) return

    const avatar = () => {
      return (
        <div
          className={styles.avatarContainer}
          ref={el => (this.userAnchor = el)}
        >
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
          <Toolbar className={styles.toolbar}>
            {!inSearch && (
              <div className={styles.brand}>
                <h1 onClick={() => navigate('/')}>
                  {this.state.isSmall ? 'P' : 'Pick and Roll'}
                </h1>
              </div>
            )}
            <div className={styles.navContainer}>
              {this.renderNavBurger()}
              {this.renderNav()}
              {this.renderAvatar()}
            </div>
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
