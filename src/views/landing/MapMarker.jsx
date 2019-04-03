/* eslint-disable no-undef */
import React from "react"
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel"
import GradeOutlined from "@material-ui/icons/GradeOutlined"
import Grade from "@material-ui/icons/Grade"
import { InfoWindow } from "react-google-maps"
import Popper from "@material-ui/core/Popper"
import Paper from "@material-ui/core/Paper"

import MarkerPopper from "./MarkerPopper"

import styles from "./MapMarker.module.scss"
import markerIcon from "../../static/marker.png"

class MapMarker extends React.Component {
  state = {
    showInfo: false,
    popperEntered: false,
    className: styles.bubble
  }
  timeout = null
  onMouseOver = () => {
    clearTimeout(this.timeout)
    this.setState({ showInfo: true, className: styles.bubbleLight })
  }
  onMouseOut = e => {
    this.timeout = setTimeout(() => {
      if (!this.state.popperEntered) {
        this.setState({ showInfo: false, className: styles.bubble })
      }
    }, 0)
  }
  render() {
    return (
      <MarkerWithLabel
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        position={this.props.position}
        labelClass={this.state.className}
        icon={{ url: "" }}
        labelAnchor={new google.maps.Point(16, 40)}
      >
        <div ref={el => (this.myAnchor = el)}>
          <div className={styles.index}>1</div>
          <Popper
            className={styles.popper}
            onMouseEnter={e => this.setState({ popperEntered: true })}
            onMouseLeave={e =>
              this.setState({
                popperEntered: false,
                showInfo: false,
                className: styles.bubble
              })
            }
            anchorEl={this.myAnchor}
            placement="top-start"
            open={this.state.showInfo}
          >
            <Paper style={{borderRadius: '0', padding: '10px'}}>The content of the Popper</Paper>
          </Popper>
        </div>
      </MarkerWithLabel>
    )
  }
}

export default MapMarker
