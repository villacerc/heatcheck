import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'

import axios from '../services/axios'
import { updateUser, popModal } from '../actions'

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
            const {
              values: { email, password },
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit
            } = props

            return (
              <form onSubmit={handleSubmit}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                  <TextField
                    id="email"
                    name="email"
                    helperText={touched.email ? errors.email : ''}
                    error={touched.email && Boolean(errors.email)}
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <TextField
                    id="password"
                    name="password"
                    helperText={touched.password ? errors.password : ''}
                    error={touched.password && Boolean(errors.password)}
                    label="Password"
                    fullWidth
                    type="password"
                    value={password}
                    onBlur={handleBlur}
                    onChange={handleChange}
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
