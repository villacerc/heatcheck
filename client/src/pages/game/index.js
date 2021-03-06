import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'
import { withSnackbar } from 'notistack'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'

import NotFound from '../notFound'
import axios from '../../services/axios'
import PlayerItem from '../../components/playerItem'
import { showModal, updateUser, fetchGame } from '../../actions'

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

    let gameId = null
    if (user.createdGame) gameId = user.createdGame.id
    if (user.joinedGame) gameId = user.joinedGame.id

    if (gameId) {
      this.props.fetchGame(gameId)
    } else {
      this.setState({ loaded: true })
    }
  }
  deleteGame = async () => {
    const res = await axios.delete('/api/delete-game')
    if (res.status === 200) {
      await this.props.updateUser()
      navigate('/')
      this.props.enqueueSnackbar('Successfully deleted game.', {
        variant: 'success'
      })
    }
  }
  leaveGame = async () => {
    const res = await axios.post('/api/leave-game')
    if (res.status === 200) {
      navigate('/')
      this.props.updateUser()
      this.props.enqueueSnackbar('You have left the game.', {
        variant: 'success'
      })
    }
  }
  joinGame = async () => {
    if (!this.props.user.payload) {
      return this.props.showModal('login')
    }
    await axios.post('/api/join-game', { gameId: this.props.game.payload.id })
    this.props.updateUser()
  }
  renderJoinButton = () => {
    const game = this.props.game.payload
    const user = this.props.user.payload

    const joined = user && user.joinedGame && user.joinedGame.id === game.id

    if (joined) return null

    const joining = user && user.joinRequests.find(({ id }) => game.id === id)

    return (
      <Button
        onClick={this.joinGame}
        variant="outlined"
        color="primary"
        size="small"
        disabled={Boolean(joining)}
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
    )
  }
  render() {
    if (!this.state.loaded) return null

    const game = this.props.game.payload

    if (!game) return <NotFound />

    const user = this.props.user.payload

    const creator = user && game.userId === user.id
    const joined = user && user.joinedGame && user.joinedGame.id === game.id

    const joinRequests = game.pendingPlayers.filter(
      ({ Request }) => Request.type === 'join'
    )

    return (
      <div className={styles.container}>
        <Card classes={{ root: styles.card }}>
          <div className={styles.header}>
            <h1>{game.name}</h1>
            <h3> {game.venue.name}</h3>
            <p>{game.description}</p>
          </div>
          {creator ? (
            <div className={styles.actions}>
              <Button
                onClick={() => this.props.showModal('invite players')}
                variant="contained"
                size="large"
                color="primary"
              >
                Invite Players
              </Button>
              <Button
                onClick={() =>
                  this.props.showModal('game requests', { type: 'joins' })
                }
                variant="contained"
                size="large"
                color="primary"
                disabled={!joinRequests[0]}
              >
                Join Requests ({joinRequests.length})
              </Button>
            </div>
          ) : (
            <div className={styles.actions}>{this.renderJoinButton()}</div>
          )}
          <h4 style={{ marginTop: 0 }}>Players</h4>
          <div className={styles.playerList}>
            {game.players.map((player, i) => (
              <div key={i} style={{ marginBottom: '.5rem' }}>
                <PlayerItem
                  isGameCreator={game.userId === player.id}
                  player={player}
                  invited={true}
                />
              </div>
            ))}
          </div>
          {creator && (
            <div className={styles.footer}>
              <Button
                onClick={() =>
                  this.abortConfirmation('delete', this.deleteGame)
                }
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
        </Card>
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
  connect(reduxStates, { showModal, updateUser, fetchGame })(Game)
)
