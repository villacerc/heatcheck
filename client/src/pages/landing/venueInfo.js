import React from 'react'
import store from '../../reducer'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

import { updateUser, fetchVenues, showModal } from '../../actions'
import axios from '../../services/axios'

import styles from './venueInfo.module.scss'

class VenueInfo extends React.Component {
  checkIn = async () => {
    const user = store.getState().user.payload
    if (!user) {
      if (this.props.closePopper) this.props.closePopper()
      return store.dispatch(
        showModal('login', { venueId: this.props.venue.id })
      )
    }
    const res = await axios.post('/api/checkin', {
      venueId: this.props.venue.id
    })
    if (res.status === 200) {
      await store.dispatch(updateUser(res.data.user))
      store.dispatch(fetchVenues())
    }
  }
  showCreateModal = () => {
    const user = store.getState().user.payload

    if (this.props.closePopper) this.props.closePopper()

    if (!user) {
      return store.dispatch(showModal('login'))
    }
    return store.dispatch(
      showModal('create game', { venueId: this.props.venue.id })
    )
  }
  render() {
    const user = store.getState().user.payload
    const { venue } = this.props

    const checkedIn = venue.id == (user && user.checkIn.venueId)
    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <h4>{venue.name}</h4>
          <p>{venue.address}</p>

          <div className={styles.actions}>
            {checkedIn ? (
              <Icon classes={{ root: styles.checkedIn }}>check_circle</Icon>
            ) : (
              <Button
                classes={{ root: styles.checkIn }}
                variant="outlined"
                size="small"
                onClick={this.checkIn}
              >
                Check-in
              </Button>
            )}
            <Button
              onClick={this.showCreateModal}
              variant="outlined"
              color="primary"
              size="small"
            >
              Create Game
            </Button>
          </div>
        </div>
        <div className={styles.status}>
          <div>3 Games</div>
          <div>5 Checked-in</div>
        </div>
      </div>
    )
  }
}

export default VenueInfo
