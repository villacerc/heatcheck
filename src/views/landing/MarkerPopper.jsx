import React from "react"
import Cancel from "@material-ui/icons/CancelOutlined"

import styles from "./MarkerPopper.module.scss"

class MarkerPopper extends React.Component {
  closePopper = e => {
    e.stopPropagation()
    this.props.closePopper()
  }
  render() {
    return (
      <div className={styles.popper}>
        TEEEeeeeeest TEEEeeeeeest TEEEeeeeeest TEEEeeeeeest TEEEeeeeeest
        TEEEeeeeeest
        <Cancel />
      </div>
    )
  }
}

export default MarkerPopper
