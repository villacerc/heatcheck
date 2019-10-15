import React from 'react'
import store from '../../reducer'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Card from '@material-ui/core/Card'
import { Link } from '@reach/router'
import classNames from 'classnames'

import { abandonGameDialog } from '../../helpers'
import {
  updateUser,
  fetchVenues,
  showModal,
  setMapCenter,
  setSideMenuIsVisible
} from '../../actions'
import axios from '../../services/axios'

import styles from './venueAndGame.module.scss'

class VenueInfo extends React.Component {
  checkIn = async () => {
    const res = await axios.post('/api/checkin', {
      venueId: this.props.venue.id
    })
    if (res.status === 200) {
      await store.dispatch(updateUser())
      await store.dispatch(fetchVenues())
      this.centerMap()
    }
  }
  showCreateModal = () => {
    store.dispatch(showModal('create game', { venueId: this.props.venue.id }))
  }
  handleAction = actionCallback => {
    const user = store.getState().user.payload

    if (this.props.closePopper) this.props.closePopper()

    if (!user) {
      return store.dispatch(
        showModal('login', { checkIn: true, venueId: this.props.venue.id })
      )
    } else if (user.createdGame || user.joinedGame) {
      return abandonGameDialog(actionCallback)
    }

    actionCallback()
  }
  centerMap = () => {
    if (window.innerWidth < 600) {
      store.dispatch(setSideMenuIsVisible(false))
      setTimeout(() => store.dispatch(setMapCenter(this.props.venue)), 300)
    } else {
      store.dispatch(setMapCenter(this.props.venue))
    }
  }
  render() {
    const user = store.getState().user.payload
    const { venue } = this.props

    const checkedIn = venue.id === (user && user.checkIn.venueId)
    return (
      <Card>
        <div className={classNames(styles.container)}>
          <div className={styles.info}>
            <Link to={`/venues/${venue.id}`}>
              <h4>{venue.name}</h4>
            </Link>
            <p>
              <span style={{ marginRight: '0.5rem', opacity: '.7' }}>
                {venue.address}
              </span>
              {this.props.hasOwnProperty('withMapLink') && (
                <button className={styles.showMap} onClick={this.centerMap}>
                  show on map
                </button>
              )}
            </p>

            <div className={styles.actions}>
              {checkedIn ? (
                <Icon classes={{ root: styles.checkedIn }}>check_circle</Icon>
              ) : (
                <Button
                  classes={{ root: styles.checkIn }}
                  variant="outlined"
                  size="small"
                  onClick={() => this.handleAction(this.checkIn)}
                >
                  Check-in
                </Button>
              )}
              <Button
                onClick={() => this.handleAction(this.showCreateModal)}
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
      </Card>
    )
  }
}

export default VenueInfo
