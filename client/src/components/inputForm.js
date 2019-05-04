import React, { Component } from 'react'
import { Formik } from 'formik'

class InputForm extends Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <Formik {...this.props} />
        </div>
      </React.Fragment>
    )
  }
}

export default InputForm
