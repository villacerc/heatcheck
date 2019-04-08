import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'

import styles from './Login.module.scss'

class Login extends React.Component {
  state = {
    open: true
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  render() {
    return (
      <Dialog
        classes={{ paper: styles.paper }}
        TransitionComponent={Transition}
        open={this.state.open}
        onClose={this.handleClose}
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

function Transition(props) {
  return <Slide direction="down" {...props} />
}

export default Login
