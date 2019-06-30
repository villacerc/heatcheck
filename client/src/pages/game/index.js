import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'
import { withSnackbar } from 'notistack'
import Fab from '@material-ui/core/Fab'

import axios from '../../services/axios'
import PlayerItem from '../../components/playerItem'
import { showModal, fetchUser, fetchGame } from '../../actions'

import styles from './game.module.scss'

class Game extends React.Component {
  state = {
    loaded: false
  }
  componentDidMount() {
    this.props.fetchGame()
  }
  componentDidUpdate() {
    if (!this.state.loaded && this.props.game.retrieved) {
      this.setState({ loaded: true })
    }
  }
  deleteConfirmation = () => {
    this.props.showModal('dialog', {
      type: 'confirmation',
      body: 'Are you sure you want delete this game?',
      confirmCallback: this.deleteGame
    })
  }
  deleteGame = async () => {
    const res = await axios.delete('/api/my-game')
    if (res.status == 200) {
      await this.props.fetchUser()
      navigate('/')
      this.props.enqueueSnackbar('Successfully deleted game.', {
        variant: 'success'
      })
    }
  }
  render() {
    if (!this.state.loaded) return null

    const game = this.props.game.payload

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>
            {game.name} @ {game.venue.name}
          </h1>
          <p>{game.description}</p>
        </div>
        <Button
          onClick={() => this.props.showModal('invite players')}
          variant="contained"
          size="large"
          color="primary"
        >
          Invite Players
        </Button>
        {game.pendingPlayers[0] && (
          <Fab
            onClick={() =>
              this.props.showModal('game requests', { type: 'joins' })
            }
            classes={{ root: styles.fab }}
            color="primary"
          >
            !
          </Fab>
        )}
        <h4>Players</h4>
        <div className={styles.playerList}>
          {game.players.map((player, i) => (
            <div key={i}>
              <PlayerItem player={player} invited={true} />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Button
            onClick={this.deleteConfirmation}
            variant="outlined"
            size="medium"
            color="secondary"
          >
            Delete
          </Button>
        </div>
      </div>
    )
  }
}

const reduxStates = state => {
  return {
    game: state.game
  }
}

export default withSnackbar(
  connect(
    reduxStates,
    { showModal, fetchUser, fetchGame }
  )(Game)
)
