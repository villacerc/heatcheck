import React from 'react'
import store from '../../reducer'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import { Link } from '@reach/router'
import classNames from 'classnames'

import { updateUser, fetchVenues, showModal, popModal } from '../../actions'
import axios from '../../services/axios'

import styles from './venueAndGame.module.scss'

class VenueInfo extends React.Component {
  checkIn = async () => {
    const user = store.getState().user.payload
    if (!user) {
      if (this.props.closePopper) this.props.closePopper()
      return store.dispatch(
        showModal('login', { checkIn: true, venueId: this.props.venue.id })
      )
    } else if (user.createdGame || user.joinedGame) {
      return this.showConfirmationDialog('checkin')
    }

    const res = await axios.post('/api/checkin', {
      venueId: this.props.venue.id
    })
    if (res.status === 200) {
      await store.dispatch(updateUser())
      store.dispatch(fetchVenues())
    }
  }
  showCreateModal = () => {
    const user = store.getState().user.payload

    if (this.props.closePopper) this.props.closePopper()

    if (!user) {
      return store.dispatch(
        showModal('login', { createGame: true, venueId: this.props.venue.id })
      )
    } else if (user.createdGame || user.joinedGame) {
      return this.showConfirmationDialog()
    }

    return store.dispatch(
      showModal('create game', { venueId: this.props.venue.id })
    )
  }
  showConfirmationDialog = action => {
    const confirmCallback = async () => {
      const user = store.getState().user.payload

      user.createdGame
        ? await axios.delete('/api/my-game')
        : await axios.post('/api/leave-game')

      await store.dispatch(updateUser())
      store.dispatch(popModal())

      action === 'checkin' ? this.checkIn() : this.showCreateModal()
    }
    store.dispatch(
      showModal('dialog', {
        type: 'confirmation',
        body: 'This will cause you to abandon your current game. Continue?',
        disableCloseInCallback: true,
        confirmCallback
      })
    )
  }
  render() {
    const user = store.getState().user.payload
    const { venue } = this.props

    const checkedIn = venue.id == (user && user.checkIn.venueId)
    return (
      <div
        className={classNames(
          styles.container,
          checkedIn ? styles.container_checkedIn : ''
        )}
      >
        <div className={styles.info}>
          <Link to={`/venues/${venue.id}`}>
            <h4>{venue.name}</h4>
          </Link>
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
        <div className={styles.venueStatus}>
          <div className={venue.games ? styles.gamesActive : ''}>
            {venue.games} Games
          </div>
          <div className={venue.checkIns ? styles.checkInsActive : ''}>
            {venue.checkIns} Checked-in
          </div>
        </div>
      </div>
    )
  }
}

export default VenueInfo
