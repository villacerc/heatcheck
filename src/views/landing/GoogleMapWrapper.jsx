import React from "react"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps"

class GoogleMapWrapper extends React.Component {
  render() {
    return (
      <GoogleMap
        {...this.props}
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
      >
        {this.props.isMarkerShown && (
          <Marker position={{ lat: -34.397, lng: 150.644 }} />
        )}
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(GoogleMapWrapper))
