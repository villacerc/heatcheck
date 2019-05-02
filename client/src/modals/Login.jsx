import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { navigate } from '@reach/router'

import styles from './Login.module.scss'

class Login extends React.Component {
  state = {
    open: true,
    loading: false
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  handleLogin = () => {
    this.setState({ loading: true })
  }
  toSignup = () => {
    navigate('/signup')
    this.handleClose()
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
          <p className={styles.signup}>
            Don't have an account? <span onClick={this.toSignup}>Sign up</span>
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={this.state.loading}
            onClick={this.handleClose}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            disabled={this.state.loading}
            onClick={this.handleLogin}
            color="primary"
          >
            Login
          </Button>
        </DialogActions>
        {this.state.loading && <LinearProgress />}
      </Dialog>
    )
  }
}

function Transition(props) {
  return <Slide direction="down" {...props} />
}

export default Login
