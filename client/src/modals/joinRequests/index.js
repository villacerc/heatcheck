import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'

import { popModal } from '../../actions'
import PlayerItem from '../../components/playerItem'

import styles from './joinRequests.module.scss'

class JoinRequests extends React.Component {
  render() {
    const game = this.props.game.payload

    return (
      <Dialog
        open={true}
        classes={{ paper: styles.dialog }}
        onClose={this.props.popModal}
      >
        <Icon onClick={this.props.popModal} className={styles.cancel}>
          cancel
        </Icon>
        {game.pendingPlayers.map((player, i) => (
          <div key={i} style={{ marginBottom: '1.3rem' }}>
            <PlayerItem key={i} joining player={player} gameId={game.id} />
          </div>
        ))}
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
)(JoinRequests)
