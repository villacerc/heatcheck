import React from 'react'

import styles from './VenueInfo.module.scss'

class VenueInfo extends React.Component {
  render() {
    const { venue } = this.props
    return (
      <div className={styles.info}>
        <h4>{venue.name}</h4>
        {/*<div className={styles.courts}>
          <label>
            Includes: 
          </label>
          <ul>
            <li>
              1x Basketball court
            </li>
            <li>
              2x Tennis court
            </li>
          </ul>
    </div>*/}
        {/* <div className={styles.grade}>8 Checked in</div>
        <div>5 Games being played</div> */}
      </div>
    )
  }
}

export default VenueInfo
