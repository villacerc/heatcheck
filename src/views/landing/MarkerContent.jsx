import React from "react"
import Paper from "@material-ui/core/Paper"

import LooInfo from "./LooInfo"

import styles from "./MarkerContent.module.scss"

class MarkerContent extends React.Component {
  render() {
    return (
      <Paper className={styles.container}>
        <div>
          <LooInfo />
          <div className={styles.address}>
            <p>1095 Hamilton St</p>
            <p>Vancouver, BC V6B 5T4</p>
          </div>
        </div>
        <div>
          <div className={styles.photo}>
            <img src="https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
          </div>
        </div>
      </Paper>
    )
  }
}

export default MarkerContent
