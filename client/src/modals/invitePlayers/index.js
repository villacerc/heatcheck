import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'

import { popModal } from '../../actions'
import PlayerItem from '../../components/playerItem'

import styles from './index.module.scss'

class InvitePlayers extends React.Component {
  getAvailablePlayers = () => {
    const { checkIns } = this.props.game.payload.venue
    return checkIns.filter(player => {
      const inGame = player.requestedGames.find(({ type }) => !type)
      if (!inGame) return player
    })
  }
  render() {
    const game = this.props.game.payload
    const players = this.getAvailablePlayers()

    return (
      <Dialog
        open={true}
        classes={{ paper: styles.dialog }}
        onClose={this.props.popModal}
      >
        <DialogTitle>
          Available Players
          <Icon onClick={this.props.popModal} className={styles.cancel}>
            cancel
          </Icon>
        </DialogTitle>
        <AppBar position="relative">
          <Tabs value={0}>
            <Tab label={`Checked in (${players.length})`} />
          </Tabs>
        </AppBar>
        <DialogContent style={{ position: 'relative' }}>
          <div style={{ marginTop: '10px' }}>
            {players.map((player, i) => {
              const inviting = player.requestedGames.find(request => {
                return request.gameId == game.id && request.type === 'invite'
              })

              return (
                <div key={i}>
                  <PlayerItem
                    inviting={inviting}
                    player={player}
                    gameId={game.id}
                  />
                </div>
              )
            })}
          </div>
        </DialogContent>
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
)(InvitePlayers)
