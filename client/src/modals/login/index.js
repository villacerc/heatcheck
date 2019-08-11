import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'

import TextInput from '../../components/textInput'
import axios from '../../services/axios'
import { updateUser, popModal, fetchVenues, showModal } from '../../actions'

import styles from './login.module.scss'

const validationSchema = Yup.object({
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string('').required('Enter your password')
})

class Login extends React.Component {
  state = {
    loading: false,
    flash: false
  }
  handleClose = () => {
    this.props.popModal()
  }
  handleLogin = async values => {
    this.setState({ flash: false })
    this.setState({ loading: true })

    const res = await axios.post('/api/login', values)

    if (res.status == 200) {
      if (this.props.checkIn) {
        await axios.post('/api/checkin', {
          venueId: this.props.venueId
        })
        this.props.updateUser()
        this.props.fetchVenues()
        return this.handleClose()
      } else if (this.props.createGame) {
        this.props.updateUser()
        await this.handleClose()

        return this.props.showModal('create game', {
          venueId: this.props.venueId
        })
      }

      await this.props.updateUser()
      this.handleClose()
      if (
        this.props.location &&
        this.props.location.pathname === '/signed-out'
      ) {
        navigate('/')
      }
    } else {
      this.setState({ flash: res.data.flash })
    }
  }
  render() {
    return (
      <Dialog
        classes={{ paper: styles.paper }}
        // TransitionComponent={Transition}
        open={true}
        onClose={this.handleClose}
      >
        {this.state.flash && (
          <div className={styles.flash}>{this.state.flash}</div>
        )}
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={this.handleLogin}
          validationSchema={validationSchema}
          render={props => {
            return (
              <form onSubmit={props.handleSubmit}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                  <TextInput
                    autoFocus
                    name="email"
                    label="Email"
                    type="email"
                    {...props}
                  />
                  <TextInput
                    name="password"
                    label="Password"
                    type="password"
                    {...props}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type="button"
                    disabled={this.state.loading}
                    onClick={this.handleClose}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={this.state.loading}
                    color="primary"
                  >
                    Submit
                  </Button>
                </DialogActions>
              </form>
            )
          }}
        />
      </Dialog>
    )
  }
}

export default connect(
  null,
  { updateUser, popModal, fetchVenues, showModal }
)(Login)
