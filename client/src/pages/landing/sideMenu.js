import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import UAParser from 'ua-parser-js'

import { setSideMenuIsVisible, setSelectedVenue } from '../../actions'
import VenueInfo from './venueInfo'
import GameInfo from '../../components/gameInfo'

import styles from './sideMenu.module.scss'

class SideMenu extends React.Component {
  state = {
    tab: 0,
    initialized: false
  }
  componentDidMount() {
    this.initialize()
  }
  initialize = async () => {
    const parser = new UAParser()

    if (parser.getDevice().type === 'mobile') {
      if (this.props.sideMenuIsVisible === null)
        await this.props.setSideMenuIsVisible(false)
    } else {
      this.props.setSideMenuIsVisible(true)
    }

    this.setState({ initialized: true })
  }
  changeTab = (e, newValue) => {
    this.setState({ tab: newValue })
  }
  renderVenues = () => {
    const { venues } = this.props
    return (
      venues &&
      venues.map(venue => {
        return (
          <div key={venue.id} className={styles.row}>
            <VenueInfo venue={venue} withMapLink />
          </div>
        )
      })
    )
  }
  renderGames = () => {
    const { games } = this.props
    if (games && !games[0])
      return <div style={{ textAlign: 'center' }}>No games found</div>
    return (
      games &&
      games.map(game => {
        return (
          <div key={game.id} className={styles.row}>
            <GameInfo game={game} />
          </div>
        )
      })
    )
  }
  renderContent = () => {
    if (this.state.tab === 0) {
      return this.renderVenues()
    }
    return this.renderGames()
  }
  hideMenu = () => {
    this.props.setSideMenuIsVisible(false)
    this.props.setSelectedVenue({})
  }
  resultsText = () => {
    if (!this.props.venues) return null

    const { locality, area, country } = this.props.venues[0] || {}

    return (
      <div style={{ padding: '10px', marginLeft: '20px' }}>
        Showing results for {locality} {area}, {country}
      </div>
    )
  }
  render() {
    if (!this.state.initialized) return null

    return (
      <Drawer
        classes={{
          paper: styles.drawer
        }}
        variant="persistent"
        anchor="left"
        open={this.props.sideMenuIsVisible}
      >
        <div className={styles.hideMenu}>
          <button
            className={styles.hideMenuButton}
            style={{ cursor: 'pointer' }}
            onClick={this.hideMenu}
          >
            <i className="fa fa-angle-left" />
          </button>
          {this.resultsText()}
        </div>
        <div
          onTouchStart={() => this.props.setSelectedVenue({})}
          style={{ position: 'relative', height: '100%' }}
        >
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.tab}
              onChange={this.changeTab}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Venues" />
              <Tab
                label={`Games (${
                  this.props.games ? this.props.games.length : '0'
                })`}
              />
            </Tabs>
          </AppBar>
          <div className={styles.content}>{this.renderContent()}</div>
        </div>
      </Drawer>
    )
  }
}

function mapStateToProps({ venues, games, sideMenu, googleMap }) {
  return {
    venues,
    games,
    sideMenuIsVisible: sideMenu.isVisible,
    selectedVenue: googleMap.selectedVenue
  }
}

export default connect(
  mapStateToProps,
  { setSideMenuIsVisible, setSelectedVenue }
)(SideMenu)
