import React from "react"

import GoogleMapWrapper from "./GoogleMapWrapper"
import TopBar from "./TopBar"
import Sidemenu from "./Sidemenu"

class Landing extends React.Component {
  state = {
    showSideMenu: false
  }
  render() {
    return (
      <div>
        <TopBar showMenuCb={() => this.setState({ showSideMenu: true })} />
        <GoogleMapWrapper
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <Sidemenu
          open={this.state.showSideMenu}
          hideCb={() => this.setState({ showSideMenu: false })}
        />
      </div>
    )
  }
}

export default Landing
