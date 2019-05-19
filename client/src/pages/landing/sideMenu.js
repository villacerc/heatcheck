import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import { map } from 'lodash'
import { connect } from 'react-redux'

import SideMenuRow from './sideMenuRow'

import styles from './sideMenu.module.scss'

class SideMenu extends React.Component {
  render() {
    const { venues } = this.props
    return (
      <Drawer
        classes={{
          paper: styles.drawer
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        {venues &&
          map(venues, venue => {
            return (
              <div key={venue.id}>
                <Divider />
                <SideMenuRow venue={venue} />
              </div>
            )
          })}
      </Drawer>
    )
  }
}

function mapStateToProps({ venues }) {
  return { venues }
}

export default connect(mapStateToProps)(SideMenu)
