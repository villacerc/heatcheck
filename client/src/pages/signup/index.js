import React from 'react'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'

import InputForm from '../../components/inputForm'
import SignupForm from './form'
import validationSchema from './validationSchema'
import axios from '../../services/axios'
import { updateUser } from '../../actions'

import styles from './signup.module.scss'

class Signup extends React.Component {
  onSubmit = async values => {
    const res = await axios.post('/api/signup', values)

    if (res.status === 200) {
      this.props.updateUser(res.data.user)
      navigate('/')
    }
  }

  render() {
    const values = {
      displayName: '',
      email: '',
      confirmPassword: '',
      password: ''
    }
    return (
      <div className={styles.container}>
        <InputForm
          onSubmit={this.onSubmit}
          component={SignupForm}
          initialValues={values}
          validationSchema={validationSchema}
        />
      </div>
    )
  }
}

export default connect(
  null,
  { updateUser }
)(Signup)
