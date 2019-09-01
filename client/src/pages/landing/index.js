import React from 'react'
import { connect } from 'react-redux'
import Fab from '@material-ui/core/Fab'

import { fetchVenues, showModal, fetchGames } from '../../actions'
import GoogleMapWrapper from './googleMapWrapper'
import SideMenu from './sideMenu'

import styles from './index.module.scss'

class Landing extends React.Component {
  state = {
    showSideMenu: false,
    venues: null
  }
  componentDidMount() {
    this.props.fetchVenues()
    this.props.fetchGames()
  }
  renderFab = () => {
    const { user } = this.props

    if (user && user.gameInvites[0]) {
      return (
        <Fab
          onClick={() =>
            this.props.showModal('game requests', { type: 'invites' })
          }
          color="primary"
          classes={{ root: styles.fab }}
        >
          !
        </Fab>
      )
    }
  }
  render() {
    const url =
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
    const url2 = process.env.REACT_APP_GOOGLE_MAP_URL

    return (
      <div>
        <GoogleMapWrapper
          center={
            this.props.center || {
              lat: 49.1785,
              lng: -123.12789
            }
          }
          googleMapURL={url2}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div className={styles.mapContainer} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <SideMenu
          open={this.state.showSideMenu}
          hideCb={() => this.setState({ showSideMenu: false })}
        />
        {this.renderFab()}
      </div>
    )
  }
}

const stateToProps = ({ venues, user, games, googleMap }) => {
  return {
    venues,
    user: user.payload,
    games,
    center: googleMap.center
  }
}

export default connect(
  stateToProps,
  { fetchVenues, showModal, fetchGames }
)(Landing)
