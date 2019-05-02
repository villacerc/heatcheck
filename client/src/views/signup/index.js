import React from 'react'

import InputForm from '../../extra/inputForm'
import Form from './form'
import validationSchema from './validationSchema'

import styles from './signup.module.scss'

class Signup extends React.Component {
  render() {
    const values = { name: '', email: '', confirmPassword: '', password: '' }
    return (
      <div>
        <InputForm
          component={Form}
          values={values}
          validationSchema={validationSchema}
        />
      </div>
    )
  }
}

export default Signup
