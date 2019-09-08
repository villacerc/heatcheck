import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { connect } from 'react-redux'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'

import { popModal } from '../../actions'
import PlayerItem from '../../components/playerItem'
import GameItem from '../../components/gameItem'

import styles from './gameRequests.module.scss'

class GameRequests extends React.Component {
  componentDidUpdate() {
    if (this.props.type === 'joins') {
      const game = this.props.game.payload
      const joinRequests = game.pendingPlayers.filter(
        ({ Request }) => Request.type === 'join'
      )
      if (joinRequests.length === 0) {
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

    return game.pendingPlayers.map((player, i) => {
      if (player.Request.type === 'join') {
        return (
          <div key={i} style={{ marginBottom: '1.3rem' }}>
            <PlayerItem joining player={player} gameId={game.id} />
          </div>
        )
      }
    })
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
        classes={{ paper: styles.dialog }}
        open={true}
        onClose={this.props.popModal}
      >
        <DialogTitle>
          {this.props.type === 'joins' ? 'Join Requests' : 'Game Invites'}
        </DialogTitle>
        <DialogContent>
          <div className={styles.list}>{this.renderList()}</div>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={this.props.popModal} color="primary">
            Close
          </Button>
        </DialogActions>
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
