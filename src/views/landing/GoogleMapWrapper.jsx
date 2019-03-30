/* eslint-disable no-undef */
import React from "react"
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps"
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel"

import markerIcon from "../../static/marker.png"

class GoogleMapWrapper extends React.Component {
  render() {
    return (
      <GoogleMap
        {...this.props}
        defaultZoom={20}
        defaultCenter={{ lat: 49.1785, lng: -123.12789 }}
      >
        <MarkerWithLabel
          position={{ lat: 49.1785, lng: -123.12789 }}
          icon={{ url: "" }}
          labelAnchor={new google.maps.Point(60, 35)}
        >
          <div style={{ position: "relative" }}>
            <img style={{ width: "120px", height: "40px" }} src={markerIcon} />
            <div style={{ position: "absolute", top: 0, left: '10px' }}>test</div>
          </div>
        </MarkerWithLabel>
      </GoogleMap>
    )
  }
}

export default withScriptjs(withGoogleMap(GoogleMapWrapper))
