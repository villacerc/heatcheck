import React from "react"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps"

import MapMarker from "./MapMarker"

class GoogleMapWrapper extends React.Component {
  render() {
    return (
      <GoogleMap
        {...this.props}
        defaultZoom={20}
        defaultCenter={{ lat: 49.1785, lng: -123.12789 }}
      >
        <MapMarker />
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(GoogleMapWrapper))
