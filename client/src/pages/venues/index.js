import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withCookies } from 'react-cookie'
import { Redirect } from '@reach/router'

import {
  fetchVenues,
  showModal,
  fetchGames,
  setSideMenuIsVisible,
  setSelectedVenue,
  setMapCenter
} from '../../actions'
import GoogleMapWrapper from './googleMapWrapper'
import SideMenu from './sideMenu'

import styles from './index.module.scss'

class Landing extends React.Component {
  state = {
    initialized: false,
    redirect: false
  }
  componentDidMount() {
    this.initialize()
  }

  initialize = async () => {
    const { cookies } = this.props

    const location = cookies.get('location')

    if (location) {
      await this.props.fetchVenues(location)
      const venue = this.props.venues[0]
      this.props.setMapCenter(venue)
      // this.props.fetchGames(location)

      this.setState({ initialized: true })
    } else {
      this.setState({ redirect: true, initialized: true })
    }
  }
  render() {
    if (!this.state.initialized) return null

    if (this.state.redirect) return <Redirect noThrow to="/" />

    const url =
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
    const url2 = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`

    const { sideMenuIsVisible } = this.props

    return (
      <div>
        <button
          className={styles.showSideMenu}
          onTouchStart={() => this.props.setSelectedVenue({})}
          onClick={() => this.props.setSideMenuIsVisible(true)}
        >
          <i className="fas fa-angle-right"></i>
        </button>
        <GoogleMapWrapper
          center={
            this.props.center || {
              lat: 49.1785,
              lng: -123.12789
            }
          }
          googleMapURL={url2}
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

export default withCookies(
  connect(stateToProps, {
    fetchVenues,
    showModal,
    fetchGames,
    setSideMenuIsVisible,
    setSelectedVenue,
    setMapCenter
  })(Landing)
)
