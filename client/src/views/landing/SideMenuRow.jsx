import React from "react"

import VenueInfo from "./VenueInfo"

import styles from "./SideMenuRow.module.scss"

class SideMenuRow extends React.Component {
  render() {
    const {venue} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.photo}>
            <img src="https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
          </div>
          <VenueInfo venue={venue}/>
        </div>
      </div>
    )
  }
}

export default SideMenuRow
