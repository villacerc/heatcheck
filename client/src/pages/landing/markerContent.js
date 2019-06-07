import React from 'react'
import Paper from '@material-ui/core/Paper'
import VenueInfo from './venueInfo'
import classNames from 'classnames'

import axios from '../../services/axios'

import styles from './markerContent.module.scss'

class MarkerContent extends React.Component {
  checkIn = async venueId => {
    if (!this.props.user) {
      this.props.closePopper()
      return this.props.showModal('login', { venueId })
    }
    const res = await axios.post('/api/checkin', { venueId })
    if (res.status === 200) {
      await this.props.updateUser(res.data.user)
      this.props.fetchVenues()
    }
  }
  showCreateModal = () => {
    this.props.closePopper()
    if (!this.props.user) {
      return this.props.showModal('login')
    }
    return this.props.showModal('create game', { venueId: this.props.venue.id })
  }
  render() {
    const { venue, checkedIn } = this.props
    return (
      <Paper className={styles.container}>
        <div>
          <div>
            <VenueInfo venue={venue} />
            <p onClick={this.showCreateModal}>Create Game</p>
            {checkedIn ? (
              <p className={classNames(styles.checkIn, styles.active)}>
                Checked in
              </p>
            ) : (
              <p
                onClick={() => this.checkIn(venue.id)}
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
