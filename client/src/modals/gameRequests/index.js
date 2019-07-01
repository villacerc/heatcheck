import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'

import { popModal } from '../../actions'
import PlayerItem from '../../components/playerItem'
import GameItem from '../../components/gameItem'

import styles from './gameRequests.module.scss'

class GameRequests extends React.Component {
  componentDidUpdate() {
    if (this.props.type === 'joins') {
      const game = this.props.game.payload
      if (game.pendingPlayers.length === 0) {
        this.props.popModal()
      }
    } else if (this.props.type === 'invites') {
      if (this.props.user.joinedGame) {
        this.props.popModal()
      }
    }
  }
  renderJoinRequests = () => {
    const game = this.props.game.payload

    return game.pendingPlayers.map((player, i) => (
      <div key={i} style={{ marginBottom: '1.3rem' }}>
        <PlayerItem joining player={player} gameId={game.id} />
      </div>
    ))
  }
  renderGameInvites = () => {
    const { gameInvites } = this.props.user

    return gameInvites.map((game, i) => (
      <div key={i} style={{ marginBottom: '1.3rem' }}>
        <GameItem game={game} />
      </div>
    ))
  }
  renderList = () => {
    if (this.props.type === 'joins') return this.renderJoinRequests()

    return this.renderGameInvites()
  }
  render() {
    return (
      <Dialog
        open={true}
        classes={{ paper: styles.dialog }}
        onClose={this.props.popModal}
      >
        {this.renderList()}
        <Button onClick={this.props.popModal} className={styles.close}>
          Close
        </Button>
      </Dialog>
    )
  }
}

const reduxStates = ({ game, user }) => {
  return {
    game,
    user: user.payload
  }
}

export default connect(
  reduxStates,
  { popModal }
)(GameRequests)
