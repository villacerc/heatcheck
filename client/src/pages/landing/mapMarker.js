/* eslint-disable no-undef */
import React from 'react'
import MarkerWithLabel from 'react-google-maps/lib/components/addons/MarkerWithLabel'
import Popper from '@material-ui/core/Popper'

import MarkerContent from './markerContent'

import styles from './mapMarker.module.scss'

class MapMarker extends React.Component {
  state = {
    showPopper: false,
    popperEntered: false,
    className: styles.bubble
  }
  timeout = null
  onMouseOver = () => {
    clearTimeout(this.timeout)
    this.setState({ showPopper: true, className: styles.bubbleLight })
  }
  onMouseOut = e => {
    //hide popper and remove highlight if not inside popper
    this.timeout = setTimeout(() => {
      if (!this.state.popperEntered) {
        this.setState({ showPopper: false, className: styles.bubble })
      }
    }, 0)
  }
  onPopperEnter = () => {
    this.setState({ popperEntered: true })
  }
  onPopperLeave = () => {
    this.setState({
      popperEntered: false,
      showPopper: false,
      className: styles.bubble
    })
  }
  render() {
    const { venue } = this.props

    return (
      <MarkerWithLabel
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        position={{ lat: venue.lat, lng: venue.lng }}
        labelClass={this.state.className}
        icon={{ url: '' }}
        labelAnchor={new google.maps.Point(16, 40)}
      >
        <div ref={el => (this.myAnchor = el)}>
          <Popper
            className={styles.popper}
            onMouseEnter={this.onPopperEnter}
            onMouseLeave={this.onPopperLeave}
            anchorEl={this.myAnchor}
            placement="top-start"
            open={this.state.showPopper}
          >
            <MarkerContent venue={venue} />
          </Popper>
        </div>
      </MarkerWithLabel>
    )
  }
}

export default MapMarker
