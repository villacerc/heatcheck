import React from "react"

import GoogleMapWrapper from "./GoogleMapWrapper"
import TopBar from "./TopBar"
import Sidemenu from "./Sidemenu"

class Landing extends React.Component {
  render() {
    return (
      <div>
        <TopBar />
        <GoogleMapWrapper
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <Sidemenu />
      </div>
    )
  }
}

export default Landing
