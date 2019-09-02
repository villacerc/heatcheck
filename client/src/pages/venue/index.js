import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'

import NotFound from '../notFound'
import { abandonGameDialog } from '../../helpers'
import axios from '../../services/axios'
import GameInfo from '../../components/gameInfo'
import { showModal, updateUser, fetchGame } from '../../actions'

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
    this.setState({ venue: res.data.venue, loaded: true })
  }
  checkIn = async () => {
    const res = await axios.post('/api/checkin', {
      venueId: this.state.venue.id
    })
    if (res.status === 200) {
      await this.props.updateUser()
      this.fetchVenue()
    }
  }
  createGame = () => {
    this.props.showModal('create game', {
      venueId: this.state.venue.id,
      successCallback: this.fetchVenue
    })
  }
  handleAction = actionCallback => {
    const { user } = this.props

    if (this.props.closePopper) this.props.closePopper()

    if (!user) {
      return this.props.showModal('login', {
        checkIn: true,
        venueId: this.state.venue.id
      })
    } else if (user.createdGame || user.joinedGame) {
      return abandonGameDialog(actionCallback)
    }

    actionCallback()
  }
  render() {
    if (!this.state.loaded) return null

    const { venue } = this.state

    if (!venue) return <NotFound />

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
          <Button
            onClick={() => this.handleAction(this.createGame)}
            variant="outlined"
            color="primary"
          >
            Create Game
          </Button>
          {!checkedIn && (
            <Button
              classes={{ root: styles.checkIn }}
              onClick={() => this.handleAction(this.checkIn)}
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
  { showModal, updateUser, fetchGame }
)(Game)
