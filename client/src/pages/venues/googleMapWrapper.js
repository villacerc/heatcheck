import React from 'react'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

import { setSelectedVenue } from '../../actions'

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
    if (this.props.selectedVenue.id) {
      this.props.setSelectedVenue({})
    }
  }
  render() {
    const { venues, user } = this.props

    return (
      <GoogleMap
        {...this.props}
        defaultOptions={{ styles: this.myStyles, streetViewControl: false }}
        gestureHandling="cooperative"
        defaultZoom={12}
        onDragStart={this.resetCenteredValue}
        onZoomChanged={this.resetCenteredValue}
      >
        {venues &&
          venues.map(venue => {
            const checkedIn = venue.id == (user && user.checkIn && user.checkIn.venueId)
            return (
              <MapMarker key={venue.id} venue={venue} checkedIn={checkedIn} />
            )
          })}
      </GoogleMap>
    )
  }
}

function reduxProps({ venues, user, googleMap }) {
  return { venues, user: user.payload, selectedVenue: googleMap.selectedVenue }
}

GoogleMapWrapper = withScriptjs(withGoogleMap(GoogleMapWrapper))

export default connect(reduxProps, { setSelectedVenue })(GoogleMapWrapper)
