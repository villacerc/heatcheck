import React from "react"
import Drawer from "@material-ui/core/Drawer"

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
        open={true}
      />
    )
  }
}

export default Sidemenu
