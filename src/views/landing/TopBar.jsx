import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"

import styles from "./TopBar.module.scss"

class TopBar extends React.Component {
  render() {
    return (
      <AppBar classes={{root: styles.bar}}>
        <Toolbar>
          <div className={styles.brand}>
            <h1 >Heat Check</h1>
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default TopBar
