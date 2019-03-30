import React from "react"
import Drawer from "@material-ui/core/Drawer"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"

import styles from "./Sidemenu.module.scss"

class Sidemenu extends React.Component {
  render() {
    return (
      <Drawer
        classes={{
          paper: styles.drawer
        }}
        variant="persistent"
        anchor="left"
        open={this.props.open}
      >
        <div className={styles.header}>
          <IconButton onClick={this.props.hideCb}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider/>
      </Drawer>
    )
  }
}

export default Sidemenu
