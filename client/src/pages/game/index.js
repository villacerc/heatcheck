import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'

import axios from '../../services/axios'
import PlayerItem from '../../components/playerItem'
import { showModal, fetchUser } from '../../actions'

import styles from './game.module.scss'

class Game extends React.Component {
  state = {
    game: null
  }
  componentDidMount() {
    this.fetchGame()
  }
  fetchGame = async () => {
    const res = await axios.get('/api/my-game')
    if (res.status == 200) {
      this.setState({ game: res.data.game })
    }
  }
  deleteGame = async () => {
    const res = await axios.delete('/api/my-game')
    if (res.status == 200) {
      await this.props.fetchUser()
      navigate('/')
    }
  }
  render() {
    const { game } = this.state
    if (!game) return null
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>
            {game.name} @ {game.venue.name}
          </h1>
          <p>{game.description}</p>
        </div>
        <Button
          onClick={() =>
            this.props.showModal('invite players', {
              checkIns: game.venue.checkIns
            })
          }
          variant="contained"
          size="large"
          color="primary"
        >
          Invite Players
        </Button>
        <div className={styles.playerList}>
          {game.players.map((player, i) => (
            <div key={i}>
              <PlayerItem player={player} invited={true} />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Button
            onClick={this.deleteGame}
            variant="contained"
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

export default connect(
  null,
  { showModal, fetchUser }
)(Game)
