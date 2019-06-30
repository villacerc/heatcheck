import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'

import { popModal } from '../../actions'
import PlayerItem from '../../components/playerItem'

import styles from './gameRequests.module.scss'

class GameRequests extends React.Component {
  componentDidUpdate() {
    const game = this.props.game.payload

    if (game.pendingPlayers.length === 0) {
      this.props.popModal()
    }
  }
  renderJoinRequests = () => {
    const game = this.props.game.payload

    return game.pendingPlayers.map((player, i) => (
      <div key={i} style={{ marginBottom: '1.3rem' }}>
        <PlayerItem key={i} joining player={player} gameId={game.id} />
      </div>
    ))
  }
  renderList = () => {
    if (this.props.type === 'joins') return this.renderJoinRequests()
  }
  render() {
    return (
      <Dialog
        open={true}
        classes={{ paper: styles.dialog }}
        onClose={this.props.popModal}
      >
        <Icon onClick={this.props.popModal} className={styles.cancel}>
          cancel
        </Icon>
        {this.renderList()}
      </Dialog>
    )
  }
}

const reduxStates = state => {
  return {
    game: state.game
  }
}

export default connect(
  reduxStates,
  { popModal }
)(GameRequests)
