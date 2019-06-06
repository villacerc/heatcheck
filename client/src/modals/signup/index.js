import React from 'react'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Formik } from 'formik'

import validationSchema from './validationSchema'
import axios from '../../services/axios'
import { updateUser, popModal } from '../../actions'

import styles from './signup.module.scss'

class Signup extends React.Component {
  state = {
    submitting: false
  }
  submit = async values => {
    this.setState({ submitting: true })
    const res = await axios.post('/api/signup', values)

    if (res.status === 200) {
      this.props.updateUser(res.data.user)
      navigate('/')
    }

    this.setState({ submitting: false })
  }
  handleClose = () => {
    this.props.popModal()
  }
  render() {
    const values = {
      displayName: '',
      email: '',
      confirmPassword: '',
      password: ''
    }
    return (
      <Dialog
        classes={{ paper: styles.paper }}
        open={true}
        onClose={this.handleClose}
      >
        <Formik
          initialValues={values}
          onSubmit={this.submit}
          validationSchema={validationSchema}
          render={props => {
            const {
              values: { displayName, email, password, confirmPassword },
              errors,
              touched,
              handleChange,
              isValid,
              handleBlur,
              handleSubmit
            } = props

            return (
              <form onSubmit={handleSubmit}>
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    id="displayName"
                    name="displayName"
                    helperText={touched.displayName ? errors.displayName : ''}
                    error={touched.displayName && Boolean(errors.displayName)}
                    label="Display Name"
                    value={displayName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                  <TextField
                    id="email"
                    name="email"
                    helperText={touched.email ? errors.email : ''}
                    error={touched.email && Boolean(errors.email)}
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    helperText={
                      touched.confirmPassword ? errors.confirmPassword : ''
                    }
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    label="Confirm Password"
                    fullWidth
                    type="password"
                    value={confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    type="button"
                    disabled={this.state.submitting}
                    onClick={this.handleClose}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={!isValid || this.state.submitting}
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
)(Signup)
