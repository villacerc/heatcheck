import React from 'react'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

import { setCenteredVenue } from '../../actions'

import MapMarker from './mapMarker'

class GoogleMapWrapper extends React.Component {
  myStyles = [
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    }
  ]
  resetCenteredValue = () => {
    if (this.props.centeredVenue.id) {
      this.props.setCenteredVenue({})
    }
  }
  render() {
    const { venues, user } = this.props

    return (
      <GoogleMap
        {...this.props}
        options={{ styles: this.myStyles }}
        defaultZoom={12}
        onDragStart={this.resetCenteredValue}
        onZoomChanged={this.resetCenteredValue}
      >
        {venues &&
          venues.map(venue => {
            const checkedIn = venue.id == (user && user.checkIn.venueId)
            return (
              <MapMarker key={venue.id} venue={venue} checkedIn={checkedIn} />
            )
          })}
      </GoogleMap>
    )
  }
}

function reduxProps({ venues, user, googleMap }) {
  return { venues, user: user.payload, centeredVenue: googleMap.centeredVenue }
}

GoogleMapWrapper = withScriptjs(withGoogleMap(GoogleMapWrapper))

export default connect(
  reduxProps,
  { setCenteredVenue }
)(GoogleMapWrapper)
