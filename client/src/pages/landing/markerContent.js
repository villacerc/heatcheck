import React from 'react'
import Paper from '@material-ui/core/Paper'
import VenueInfo from './venueInfo'
import classNames from 'classnames'

import axios from '../../services/axios'

import styles from './markerContent.module.scss'

class MarkerContent extends React.Component {
  checkIn = async venueId => {
    const res = await axios.post('/api/checkin', { venueId })
    await this.props.updateUser(res.data.user)
    this.props.fetchVenues()
  }
  render() {
    const { venue, checkedIn } = this.props
    return (
      <Paper className={styles.container}>
        <div>
          <div>
            <VenueInfo venue={venue} />
            {checkedIn ? (
              <p className={classNames(styles.checkIn, styles.active)}>
                Checked in
              </p>
            ) : (
              <p
                onClick={() => this.checkIn(venue._id)}
                className={classNames(styles.checkIn, styles.inActive)}
              >
                Check in
              </p>
            )}
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
