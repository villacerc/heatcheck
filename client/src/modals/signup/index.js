import React from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Formik } from 'formik'

import TextInput from '../../components/textInput'
import validationSchema from './validationSchema'
import axios from '../../services/axios'
import { fetchUser, popModal } from '../../actions'

import styles from './signup.module.scss'

class Signup extends React.Component {
  state = {
    submitting: false
  }
  submit = async values => {
    this.setState({ submitting: true })
    const res = await axios.post('/api/signup', values)

    if (res.status === 200) {
      this.props.fetchUser(res.data.user)
      this.handleClose()
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
            return (
              <form onSubmit={props.handleSubmit}>
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent>
                  <TextInput
                    autoFocus
                    name="displayName"
                    label="Display Name"
                    {...props}
                  />
                  <TextInput
                    name="email"
                    type="email"
                    label="Email"
                    {...props}
                  />
                  <TextInput
                    name="password"
                    label="Password"
                    type="password"
                    {...props}
                  />
                  <TextInput
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    {...props}
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
                    disabled={!props.isValid || this.state.submitting}
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
  { fetchUser, popModal }
)(Signup)
