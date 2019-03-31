/* eslint-disable no-undef */
import React from "react"
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel"

import styles from "./MapMarker.module.scss"
import markerIcon from "../../static/marker.png"

class MapMarker extends React.Component {
  state = {
    showPopper: false
  }
  render() {
    return (
      <MarkerWithLabel
        onClick={() => this.setState({ showPopper: true })}
        position={{ lat: 49.1785, lng: -123.12789 }}
        icon={{ url: "" }}
        labelClass={styles.marker}
        labelAnchor={new google.maps.Point(60, 35)}
      >
        <div style={{ position: "relative" }}>
          <img style={{ width: "120px", height: "40px" }} src={markerIcon} />
          <div style={{ position: "absolute", top: "3px", left: "10px" }}>
            <i
              style={{ color: "yellow", fontSize: "18px" }}
              className="fas fa-star"
            />
            <i
              style={{ color: "yellow", fontSize: "18px" }}
              className="fas fa-star"
            />
            <i
              style={{ color: "yellow", fontSize: "18px" }}
              className="fas fa-star"
            />
            <i
              style={{ color: "yellow", fontSize: "18px" }}
              className="fas fa-star"
            />
            <i
              style={{ color: "yellow", fontSize: "18px" }}
              className="far fa-star"
            />
          </div>
          {this.state.showPopper && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: "translate(0,-70%)"
              }}
            >
              TEEEeeeeeest TEEEeeeeeest TEEEeeeeeest TEEEeeeeeest TEEEeeeeeest
              TEEEeeeeeest
            </div>
          )}
        </div>
      </MarkerWithLabel>
    )
  }
}

export default MapMarker
