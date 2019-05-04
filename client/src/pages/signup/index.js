import React from 'react'

import InputForm from '../../components/inputForm'
import { SignupForm, onSubmit } from './form'
import validationSchema from './validationSchema'

import styles from './signup.module.scss'

class Signup extends React.Component {
  render() {
    const values = {
      displayName: '',
      email: '',
      confirmPassword: '',
      password: ''
    }
    return (
      <div>
        <InputForm
          onSubmit={onSubmit}
          component={SignupForm}
          initialValues={values}
          validationSchema={validationSchema}
        />
      </div>
    )
  }
}

export default Signup
