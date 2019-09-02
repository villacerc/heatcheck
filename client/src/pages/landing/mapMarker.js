/* eslint-disable no-undef */
import React from 'react'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import Popper from '@material-ui/core/Popper'
import classNames from 'classnames'
import store from '../../reducer'

import { setSelectedVenue } from '../../actions'
import MarkerContent from './markerContent'

import styles from './mapMarker.module.scss'

class MapMarker extends React.Component {
  state = {
    showPopper: false,
    popperEntered: false,
    className: this.props.checkedIn ? styles.bubbleCheckedIn : '',
    selectedVenue: {}
  }
  timeout = null
  componentDidUpdate(prevProps) {
    if (prevProps.checkedIn !== this.props.checkedIn) {
      if (this.props.checkedIn) {
        this.setState({ className: styles.bubbleCheckedIn })
      } else {
        this.setState({ className: '' })
      }
    }

    this.setSelectedVenue()
  }
  setSelectedVenue = () => {
    const { selectedVenue } = store.getState().googleMap
    if (this.state.selectedVenue.id !== selectedVenue.id) {
      this.setState({ selectedVenue }, this.shouldShowPopper)
    }
  }
  shouldShowPopper = () => {
    const { selectedVenue } = this.state
    const { venue } = this.props

    if (selectedVenue.id === venue.id) {
      setTimeout(this.showPopper, 0)
    } else {
      this.closePopper()
    }
  }
  onMouseOver = () => {
    clearTimeout(this.timeout)
    this.showPopper()
    store.dispatch(setSelectedVenue(this.props.venue))
  }
  onMouseOut = e => {
    //hide popper and remove highlight if not inside popper
    this.timeout = setTimeout(() => {
      if (!this.state.popperEntered) {
        this.closePopper()
      }
    }, 0)
  }
  onPopperEnter = () => {
    this.setState({ popperEntered: true })
  }
  onPopperLeave = () => {
    this.setState({
      popperEntered: false
    })
    this.closePopper()
  }
  showPopper = () => {
    this.setState({ showPopper: true, className: styles.bubbleLight })
  }
  closePopper = () => {
    this.setState({
      showPopper: false,
      className: this.props.checkedIn ? styles.bubbleCheckedIn : ''
    })
  }
  getMoreStyles = () => {
    const { venue } = this.props
    let bubble = ''
    let status = ''
    let point = 16

    if (venue.checkIns && venue.games) {
      bubble = classNames(styles.large, styles.bubbleActive)
      point = 45
    } else if (venue.checkIns || venue.games) {
      bubble = classNames(styles.medium, styles.bubbleActive)
      point = 25
      status = styles.statusCenter
    }

    return {
      bubble,
      point,
      status
    }
  }
  onClick = () => {
    this.showPopper()
    store.dispatch(setSelectedVenue(this.props.venue))
  }
  render() {
    const { venue } = this.props
    const moreStyles = this.getMoreStyles()

    return (
      <MarkerWithLabel
        onClick={this.onClick}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        position={{ lat: venue.lat, lng: venue.lng }}
        labelClass={classNames(
          styles.bubble,
          this.state.className,
          moreStyles.bubble
        )}
        icon={{ url: '' }}
        labelAnchor={new google.maps.Point(moreStyles.point, 40)}
      >
        <div ref={el => (this.myAnchor = el)}>
          <div className={classNames(styles.status, moreStyles.status)}>
            {venue.checkIns !== 0 && (
              <div>
                {venue.checkIns}
                <i className="fa fa-check" />
              </div>
            )}
            {venue.games !== 0 && (
              <div>
                {venue.games}
                <i className="fa fa-basketball-ball" />
              </div>
            )}
          </div>
          <Popper
            className={styles.popper}
            onMouseEnter={this.onPopperEnter}
            onMouseLeave={this.onPopperLeave}
            anchorEl={this.myAnchor}
            placement="top-start"
            open={this.state.showPopper}
          >
            <MarkerContent closePopper={this.closePopper} venue={venue} />
          </Popper>
        </div>
      </MarkerWithLabel>
    )
  }
}

export default MapMarker
