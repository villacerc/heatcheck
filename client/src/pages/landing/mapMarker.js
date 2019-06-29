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
    className: this.props.checkedIn ? styles.bubbleLight : styles.bubble
  }
  timeout = null
  componentDidUpdate(prevProps) {
    if (prevProps.checkedIn !== this.props.checkedIn) {
      if (this.props.checkedIn) {
        this.setState({ className: styles.bubbleLight })
      } else {
        this.setState({ className: styles.bubble })
      }
    }
  }
  onMouseOver = () => {
    clearTimeout(this.timeout)
    this.setState({ showPopper: true, className: styles.bubbleLight })
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
  closePopper = () => {
    this.setState({
      showPopper: false,
      className: this.props.checkedIn ? styles.bubbleLight : styles.bubble
    })
  }
  render() {
    const { venue, contentProps, checkedIn } = this.props

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
            <MarkerContent
              closePopper={this.closePopper}
              venue={venue}
              checkedIn={checkedIn}
              {...contentProps}
            />
          </Popper>
        </div>
      </MarkerWithLabel>
    )
  }
}

export default MapMarker
