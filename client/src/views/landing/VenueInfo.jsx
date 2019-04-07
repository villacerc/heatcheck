import React from "react"
import GradeOutlined from "@material-ui/icons/GradeOutlined"
import Grade from "@material-ui/icons/Grade"
import Accessible from "@material-ui/icons/Accessible"
import ChildFriendly from "@material-ui/icons/ChildFriendly"

import styles from "./VenueInfo.module.scss"

class VenueInfo extends React.Component {
  render() {
    return (
      <div className={styles.info}>
        <h3>1. Stanley Park</h3>
        <div className={styles.grade}>
          <Grade />
          <Grade />
          <Grade />
          <Grade />
          <GradeOutlined />
        </div>
        <div className={styles.reviews}>8156 reviews</div>
        <div>
          <Accessible />
          <ChildFriendly />
          <span style={{ margin: "0 10px" }}>•</span>
          Public
        </div>
      </div>
    )
  }
}

export default VenueInfo
