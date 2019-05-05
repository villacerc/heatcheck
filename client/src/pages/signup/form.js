import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { Form } from 'formik'

export const onSubmit = async values => {
  const res = await axios.post('/api/signup', values)
}

const getUser = async values => {
  const res = await axios.get('/api/user')
}

export const SignupForm = props => {
  const {
    values: { displayName, email, password, confirmPassword },
    errors,
    touched,
    handleChange,
    isValid,
    setFieldTouched
  } = props

  const change = (name, e) => {
    e.persist()
    handleChange(e)
    setFieldTouched(name, true, false)
  }
  return (
    <Form style={{ width: '100vw', margin: 'auto' }}>
      <TextField
        id="displayName"
        name="displayName"
        helperText={touched.displayName ? errors.displayName : ''}
        error={touched.displayName && Boolean(errors.displayName)}
        label="Display Name"
        value={displayName}
        onChange={change.bind(null, 'displayName')}
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
        onChange={change.bind(null, 'email')}
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
        onChange={change.bind(null, 'password')}
      />
      <TextField
        id="confirmPassword"
        name="confirmPassword"
        helperText={touched.confirmPassword ? errors.confirmPassword : ''}
        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
        label="Confirm Password"
        fullWidth
        type="password"
        value={confirmPassword}
        onChange={change.bind(null, 'confirmPassword')}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={!isValid}
      >
        Submit
      </Button>
      <Button
        onClick={getUser}
        type="button"
        fullWidth
        variant="contained"
        color="primary"
      >
        user
      </Button>
    </Form>
  )
}
