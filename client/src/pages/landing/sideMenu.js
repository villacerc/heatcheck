import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import { connect } from 'react-redux'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import VenueInfo from './venueInfo'
import GameInfo from '../../components/gameInfo'

import styles from './sideMenu.module.scss'

class SideMenu extends React.Component {
  state = {
    tab: 0
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
            <VenueInfo venue={venue} />
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
  render() {
    return (
      <Drawer
        classes={{
          paper: styles.drawer
        }}
        variant="persistent"
        anchor="left"
        open={true}
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
      </Drawer>
    )
  }
}

function mapStateToProps({ venues, games }) {
  return { venues, games }
}

export default connect(mapStateToProps)(SideMenu)
