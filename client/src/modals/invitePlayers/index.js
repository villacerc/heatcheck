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
  render() {
    const { checkIns } = this.props
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
            <Tab label={`Checked in (0)`} />
          </Tabs>
        </AppBar>
        <DialogContent style={{ position: 'relative' }}>
          <div style={{ marginTop: '10px' }}>
            {checkIns.map((player, i) => (
              <div key={i}>
                <PlayerItem player={player} />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default connect(
  null,
  { popModal }
)(InvitePlayers)
