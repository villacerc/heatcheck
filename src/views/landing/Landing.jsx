import React from "react"

import GoogleMapWrapper from "./GoogleMapWrapper"
import TopBar from "./TopBar"
import SideMenu from "./SideMenu"

class Landing extends React.Component {
  state = {
    showSideMenu: false
  }
  render() {
    const url = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
    const url2 = process.env.REACT_APP_GOOGLE_MAP_URL
    return (
      <div>
        <TopBar showMenuCb={() => this.setState({ showSideMenu: true })} />
        <GoogleMapWrapper
          googleMapURL={url2}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <SideMenu
          open={this.state.showSideMenu}
          hideCb={() => this.setState({ showSideMenu: false })}
        />
      </div>
    )
  }
}

export default Landing
