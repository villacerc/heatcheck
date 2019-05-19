import React from 'react'
import { map } from 'lodash'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import { fetchVenues, updateUser } from '../../actions'

import MapMarker from './mapMarker'

class GoogleMapWrapper extends React.Component {
  render() {
    const { venues, user, fetchVenues, updateUser } = this.props
    const contentProps = {
      fetchVenues,
      updateUser
    }
    return (
      <GoogleMap
        {...this.props}
        defaultZoom={12}
        defaultCenter={{ lat: 49.1785, lng: -123.12789 }}
      >
        {venues &&
          map(venues, venue => {
            const checkedIn = venue.id == (user && user.checkIn.venueId)
            return (
              <MapMarker
                key={venue.id}
                venue={venue}
                checkedIn={checkedIn}
                contentProps={contentProps}
              />
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

export default connect(
  reduxProps,
  { fetchVenues, updateUser }
)(GoogleMapWrapper)
