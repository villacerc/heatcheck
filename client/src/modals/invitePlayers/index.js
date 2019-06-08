import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AppBar from '@material-ui/core/AppBar'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon'

import { popModal } from '../../actions'

import styles from './index.module.scss'

class InvitePlayers extends React.Component {
  render() {
    return (
      <Dialog
        open={true}
        classes={{ paper: styles.dialog }}
        onClose={this.props.popModal}
      >
        <DialogTitle>
          Invite Players
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
            {new Array(10).fill().map(() => (
              <Card className={styles.card}>
                <Avatar className={styles.avatar} />
                <div className={styles.content}>
                  Kardi B.
                  <Button>
                    <Icon>done</Icon>
                  </Button>
                </div>
              </Card>
            ))}
            <Card className={styles.card}>
              <Avatar className={styles.avatar}>
                <Icon>account_circle</Icon>
              </Avatar>
              <div className={styles.content}>
                <p>Kardi B.Kar B.</p>
                {/* <Button>
                  <Icon>done</Icon>
                </Button> */}
                <CircularProgress style={{ marginLeft: 'auto' }} size={20} />
                <Button style={{ marginLeft: '10px' }}>
                  <Icon className={styles.cancelInvite}>close</Icon>
                </Button>
              </div>
            </Card>
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
