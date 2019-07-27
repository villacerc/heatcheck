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
    if (!this.props.user.fetching) {
      this.fetchGame()
    }
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.user.fetching !== prevProps.user.fetching &&
      !this.props.user.fetching
    ) {
      this.fetchGame()
    } else if (!this.state.loaded && this.props.game.retrieved) {
      this.setState({ loaded: true })
    }
  }
  abortConfirmation = (action, callback) => {
    this.props.showModal('dialog', {
      type: 'confirmation',
      body: `Are you sure you want ${action} this game?`,
      confirmCallback: callback
    })
  }
  fetchGame = async () => {
    if (this.props.gameId) {
      return this.props.fetchGame(this.props.gameId)
    }
    const user = this.props.user.payload
    const state = user.createdGame ? 'created' : 'joined'

    this.props.fetchGame(state)
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
  leaveGame = async () => {
    const res = await axios.post('/api/leave-game')
    if (res.status == 200) {
      navigate('/')
      this.props.fetchUser()
      this.props.enqueueSnackbar('Successfully left game.', {
        variant: 'success'
      })
    }
  }
  render() {
    console.log(this.props)
    if (!this.state.loaded) return null

    const game = this.props.game.payload
    const user = this.props.user.payload

    const creator = user && game.userId === user.id
    const joined = user && user.joinedGame && user.joinedGame.id === game.id

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>
            {game.name} @ {game.venue.name}
          </h1>
          <p>{game.description}</p>
        </div>
        {creator && (
          <div>
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
          </div>
        )}
        <h4>Players</h4>
        <div className={styles.playerList}>
          {game.players.map((player, i) => (
            <div key={i} style={{ marginBottom: '.5rem' }}>
              <PlayerItem player={player} invited={true} />
            </div>
          ))}
        </div>
        {creator && (
          <div className={styles.footer}>
            <Button
              onClick={() => this.abortConfirmation('delete', this.deleteGame)}
              variant="outlined"
              size="medium"
              color="secondary"
            >
              Delete Game
            </Button>
          </div>
        )}
        {joined && (
          <div className={styles.footer}>
            <Button
              onClick={() => this.abortConfirmation('leave', this.leaveGame)}
              variant="outlined"
              size="medium"
              color="secondary"
            >
              Leave Game
            </Button>
          </div>
        )}
      </div>
    )
  }
}

const reduxStates = ({ user, game }) => {
  return {
    game,
    user
  }
}

export default withSnackbar(
  connect(
    reduxStates,
    { showModal, fetchUser, fetchGame }
  )(Game)
)
