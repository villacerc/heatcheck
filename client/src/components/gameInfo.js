import React from 'react'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import { connect } from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'

import { updateUser, fetchVenues, showModal, fetchUser } from '../actions'
import axios from '../services/axios'

import styles from '../pages/landing/venueAndGame.module.scss'

class GameInfo extends React.Component {
  joinGame = async () => {
    await axios.post('/api/join-game', { gameId: this.props.game.id })
    this.props.fetchUser()
  }
  render() {
    const { game, user } = this.props

    const joining = user && user.joinRequests.find(({ id }) => game.id === id)

    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <h4>{game.name}</h4>
          <p>@ {game.venue.name}</p>
          <p style={{ marginTop: '.7rem' }}>{game.description}</p>
          <div className={styles.actions}>
            <Button
              onClick={this.joinGame}
              variant="outlined"
              color="primary"
              size="small"
              disabled={joining}
              style={{ position: 'relative' }}
            >
              Join
              {joining && (
                <CircularProgress
                  style={{ position: 'absolute', left: '31%' }}
                  size={20}
                />
              )}
            </Button>
          </div>
        </div>
        <div className={styles.gameStatus}>
          <div>{game.players} Players</div>
        </div>
      </div>
    )
  }
}

const reduxState = ({ user }) => {
  return { user: user.payload }
}

export default connect(
  reduxState,
  { fetchUser }
)(GameInfo)
