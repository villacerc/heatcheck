import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'

import TextInput from '../../components/textInput'
import axios from '../../services/axios'
import { updateUser, popModal } from '../../actions'

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
  handleLogin = async (values, actions) => {
    this.setState({ flash: false })
    this.setState({ loading: true })

    if (this.props.venueId) {
      //check user in to venue
      values.venueId = this.props.venueId
    }

    const res = await axios.post('/api/login', values)

    if (res.status == 200) {
      this.props.updateUser(res.data.user)
      this.handleClose()
    } else {
      this.setState({ flash: res.data.flash })
    }
    this.setState({ loading: false })
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
  { updateUser, popModal }
)(Login)
