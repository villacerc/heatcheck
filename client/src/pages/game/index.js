import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import axios from '../../services/axios'
import PlayerItem from '../../components/playerItem'
import { showModal } from '../../actions'

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
      </div>
    )
  }
}

export default connect(
  null,
  { showModal }
)(Game)
