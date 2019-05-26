import React from 'react'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import { fetchVenues, updateUser, showModal } from '../../actions'

import MapMarker from './mapMarker'

class GoogleMapWrapper extends React.Component {
  render() {
    const { venues, user, fetchVenues, updateUser, showModal } = this.props
    const contentProps = {
      fetchVenues,
      updateUser,
      showModal,
      user
    }
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
  { fetchVenues, updateUser, showModal }
)(GoogleMapWrapper)
