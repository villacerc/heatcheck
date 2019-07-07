import React from 'react'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

import { updateUser, fetchVenues, showModal } from '../actions'
import axios from '../services/axios'

import styles from '../pages/landing/venueAndGame.module.scss'

class GameInfo extends React.Component {
  render() {
    const { game } = this.props

    return (
      <div className={styles.container}>
        <div className={styles.info}>
          <h4>{game.name}</h4>
          <p>@ {game.venue.name}</p>
          <p style={{ marginTop: '.7rem' }}>{game.description}</p>
          <div className={styles.actions}>
            <Button
              onClick={this.showCreateModal}
              variant="outlined"
              color="primary"
              size="small"
            >
              Join
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

export default GameInfo
