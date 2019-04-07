import React from "react"
import Drawer from "@material-ui/core/Drawer"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"

import SideMenuRow from "./SideMenuRow"

import styles from "./SideMenu.module.scss"

class SideMenu extends React.Component {
  render() {
    return (
      <Drawer
        classes={{
          paper: styles.drawer
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <Divider />
        <SideMenuRow />
        <Divider />
      </Drawer>
    )
  }
}

export default SideMenu
