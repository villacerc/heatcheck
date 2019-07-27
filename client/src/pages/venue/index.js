import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'

import axios from '../../services/axios'
import GameInfo from '../../components/gameInfo'
import PlayerItem from '../../components/playerItem'
import { showModal, fetchUser, fetchGame } from '../../actions'

import styles from './venue.module.scss'

class Game extends React.Component {
  state = {
    venue: null,
    loaded: false
  }
  componentDidMount() {
    this.fetchVenue()
  }
  fetchVenue = async () => {
    const res = await axios.post('/api/get-venue', {
      venueId: this.props.venueId
    })
    this.setState({ venue: res.data.venue })
  }
  checkIn = async () => {
    const { user } = this.props
    if (!user)
      return this.props.showModal('login', { venueId: this.state.venue.id })

    const res = await axios.post('/api/checkin', {
      venueId: this.state.venue.id
    })
    if (res.status === 200) {
      await this.props.fetchUser()
      this.fetchVenue()
    }
  }
  createGame = () => {
    const { user } = this.props
    if (!user) return this.props.showModal('login')
    this.props.showModal('create game', {
      venueId: this.state.venue.id,
      successCallback: this.fetchVenue
    })
  }
  render() {
    if (!this.state.venue) return null
    const { venue } = this.state
    const { user } = this.props

    const checkedIn = user && user.checkIn.venueId === venue.id

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {venue.name}
            {checkedIn && (
              <Icon classes={{ root: styles.checkedIn }}>check_circle</Icon>
            )}
          </h1>
          <p>{venue.address}</p>
        </div>
        <div className={styles.actions}>
          <Button onClick={this.createGame} variant="outlined" color="primary">
            Create Game
          </Button>
          {!checkedIn && (
            <Button
              classes={{ root: styles.checkIn }}
              onClick={this.checkIn}
              variant="outlined"
              color="primary"
            >
              Check-in
            </Button>
          )}
        </div>
        <div className={styles.status}>
          <h4>Games ({venue.games.length})</h4>
          <h4>Check-ins ({venue.checkIns})</h4>
        </div>
        <div className={styles.games}>
          {venue.games.map((game, i) => (
            <div key={i} className={styles.game}>
              <GameInfo game={game} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

const reduxStates = ({ user, game }) => {
  return {
    game,
    user: user.payload
  }
}

export default connect(
  reduxStates,
  { showModal, fetchUser, fetchGame }
)(Game)