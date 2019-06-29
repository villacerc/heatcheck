import React from 'react'

import VenueInfo from './venueInfo'

import styles from './sideMenuRow.module.scss'

class SideMenuRow extends React.Component {
  render() {
    const { venue } = this.props
    return (
      <div className={styles.container}>
        <VenueInfo venue={venue} />
      </div>
    )
  }
}

export default SideMenuRow
