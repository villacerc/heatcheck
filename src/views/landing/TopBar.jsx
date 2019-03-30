import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"

class TopBar extends React.Component {
  render() {
    return (
      <AppBar style={{ color: "white" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={this.props.showMenuCb}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }
}

export default TopBar
