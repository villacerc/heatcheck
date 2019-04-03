import React from "react"
import GradeOutlined from "@material-ui/icons/GradeOutlined"
import Grade from "@material-ui/icons/Grade"
import Accessible from "@material-ui/icons/Accessible"
import ChildFriendly from "@material-ui/icons/ChildFriendly"

import styles from "./SideMenuRow.module.scss"

class SideMenuRow extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.photo}>
            <img src="https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
          </div>
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
        </div>
      </div>
    )
  }
}

export default SideMenuRow
