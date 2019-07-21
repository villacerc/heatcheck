import React from 'react'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

import MapMarker from './mapMarker'

class GoogleMapWrapper extends React.Component {
  render() {
    const { venues, user } = this.props
    return (
      <GoogleMap
        {...this.props}
        defaultZoom={12}
        defaultCenter={{ lat: 49.1785, lng: -123.12789 }}
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

function reduxProps({ venues, user }) {
  return { venues, user: user.payload }
}

GoogleMapWrapper = withScriptjs(withGoogleMap(GoogleMapWrapper))

export default connect(reduxProps)(GoogleMapWrapper)
