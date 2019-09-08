import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import {
  fetchVenues,
  showModal,
  fetchGames,
  setSideMenuIsVisible,
  setSelectedVenue
} from '../../actions'
import GoogleMapWrapper from './googleMapWrapper'
import SideMenu from './sideMenu'

import styles from './index.module.scss'

class Landing extends React.Component {
  state = {
    venues: null
  }
  componentDidMount() {
    this.props.fetchVenues()
    this.props.fetchGames()
  }
  render() {
    const url =
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
    const url2 = process.env.REACT_APP_GOOGLE_MAP_URL

    const { sideMenuIsVisible } = this.props

    return (
      <div>
        <button
          className={styles.showSideMenu}
          onTouchStart={() => this.props.setSelectedVenue({})}
          onClick={() => this.props.setSideMenuIsVisible(true)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <GoogleMapWrapper
          center={
            this.props.center || {
              lat: 49.1785,
              lng: -123.12789
            }
          }
          googleMapURL={url}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={
            <div
              className={classNames(
                styles.mapContainer,
                sideMenuIsVisible ? styles.shrink : styles.expand
              )}
            />
          }
          mapElement={<div style={{ height: `100%` }} />}
        />
        <SideMenu />
      </div>
    )
  }
}

const stateToProps = ({ venues, user, games, googleMap, sideMenu }) => {
  return {
    venues,
    user: user.payload,
    games,
    center: googleMap.center,
    sideMenuIsVisible: sideMenu.isVisible
  }
}

export default connect(
  stateToProps,
  { fetchVenues, showModal, fetchGames, setSideMenuIsVisible, setSelectedVenue }
)(Landing)
