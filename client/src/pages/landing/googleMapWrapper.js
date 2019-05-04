import React from 'react'
import { map } from 'lodash'
import { connect } from 'react-redux'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'

import MapMarker from './mapMarker'

class GoogleMapWrapper extends React.Component {
  render() {
    const { venues } = this.props
    return (
      <GoogleMap
        {...this.props}
        defaultZoom={12}
        defaultCenter={{ lat: 49.1785, lng: -123.12789 }}
      >
        {venues &&
          map(venues, venue => {
            return <MapMarker key={venue._id} venue={venue} />
          })}
      </GoogleMap>
    )
  }
}

function mapStateToProps({ venues }) {
  return { venues }
}

GoogleMapWrapper = withScriptjs(withGoogleMap(GoogleMapWrapper))

export default connect(mapStateToProps)(GoogleMapWrapper)
