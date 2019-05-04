import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import { navigate } from '@reach/router'
import axios from 'axios'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { connect } from 'react-redux'

import { updateUser } from '../actions'

import styles from './Login.module.scss'

const validationSchema = Yup.object({
  email: Yup.string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string('').required('Enter your password')
})

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return error.response
  }
)

class Login extends React.Component {
  state = {
    open: true,
    loading: false,
    showFlash: false
  }

  handleClose = () => {
    this.setState({ open: false })
  }
  handleLogin = async (values, actions) => {
    this.setState({ showFlash: false })
    this.setState({ loading: true })
    const res = await axios.post('/api/login', values)

    console.log(res)
    if (res.status == 200) {
      this.props.updateUser(res.data.user)
      this.handleClose()
    } else {
      this.setState({ showFlash: true })
    }
    this.setState({ loading: false })
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
        {this.state.showFlash && (
          <div className={styles.flash}>Incorrect email or password</div>
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
                  <p className={styles.signup}>
                    Don't have an account?
                    <span onClick={this.toSignup}>Sign up</span>
                  </p>
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
                      Login
                    </Button>
                  </DialogActions>
                </DialogContent>
              </form>
            )
          }}
        />
      </Dialog>
    )
  }
}

function Transition(props) {
  return <Slide direction="down" {...props} />
}

export default connect(
  null,
  { updateUser }
)(Login)
