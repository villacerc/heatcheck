import React from 'react'
import Paper from '@material-ui/core/Paper'

import VenueInfo from './VenueInfo'

import styles from './MarkerContent.module.scss'

class MarkerContent extends React.Component {
  render() {
    const { venue } = this.props

    return (
      <Paper className={styles.container}>
        <div>
          <div>
            <VenueInfo venue={venue} />
            <p className={styles.checkin}>Check in</p>
          </div>
          <div>
            <div className={styles.photo}>
              <img src="https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" />
            </div>
          </div>
        </div>
        <div className={styles.address}>
          <p>{venue.address}</p>
        </div>
      </Paper>
    )
  }
}

export default MarkerContent
