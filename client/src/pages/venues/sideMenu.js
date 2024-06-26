import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { connect } from 'react-redux'
import UAParser from 'ua-parser-js'
import Button from '@material-ui/core/Button'

import { setSideMenuIsVisible, setSelectedVenue } from '../../actions'
import VenueInfo from './venueInfo'
import GameInfo from '../../components/gameInfo'

import styles from './SideMenu.module.scss'

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
  sortVenuesByGamesThenChekins = (venues) => {
    venues.sort((a, b) => {
      const gamesComparison = b.games - a.games;
      if (gamesComparison !== 0) {
        return gamesComparison;
      }
      
      return b.checkIns - a.checkIns;
    });   
  }
  prioritizeCheckedInVenue = (venues) => {
    const {user} = this.props

    if(user && user.checkIn) {
      const index = venues.findIndex(venue => venue.id === user.checkIn.venueId);
      if (index !== -1) {
          const venue = venues.splice(index, 1)[0];
          venues.unshift(venue);
      }
    }
  };
  renderVenues = () => {
    const { venues } = this.props
    this.sortVenuesByGamesThenChekins(venues)
    this.prioritizeCheckedInVenue(venues)
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
      <div className={styles.locationText}>
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
        <div className={styles.venuesListHeader}>
          <Button
            className={styles.hideMenuButton}
            style={{ cursor: 'pointer' }}
            onClick={this.hideMenu}
          >
            <i className="fa fa-angle-left" />
          </Button>
          <div className={styles.venuesListHeaderDivider}></div>
          {this.resultsText()}
        </div>
        <div
          onTouchStart={() => this.props.setSelectedVenue({})}
          className={styles.contentContainer}
          // style={{ position: 'relative', height: '100%' }}
        >
          {/* <AppBar position="static" color="default">
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
          </AppBar> */}
          <div className={styles.content}>{this.renderContent()}</div>
        </div>
      </Drawer>
    )
  }
}

function mapStateToProps({ venues, user, games, sideMenu, googleMap }) {
  return {
    venues,
    user: user.payload,
    games,
    sideMenuIsVisible: sideMenu.isVisible,
    selectedVenue: googleMap.selectedVenue
  }
}

export default connect(mapStateToProps, {
  setSideMenuIsVisible,
  setSelectedVenue
})(SideMenu)
