import React from 'react'
import { connect } from 'react-redux'

import { fetchVenues } from '../../actions'
import GoogleMapWrapper from './googleMapWrapper'
import SideMenu from './sideMenu'

class Landing extends React.Component {
  state = {
    showSideMenu: false,
    venues: null
  }
  componentDidMount() {
    this.props.fetchVenues()
  }

  render() {
    const url =
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
    const url2 = process.env.REACT_APP_GOOGLE_MAP_URL

    return (
      <div>
        <GoogleMapWrapper
          googleMapURL={url}
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

export default connect(
  null,
  { fetchVenues }
)(Landing)
