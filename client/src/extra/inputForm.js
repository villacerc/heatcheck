import React, { Component } from 'react'
import { Formik } from 'formik'

class InputForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { component, validationSchema, values } = this.props
    return (
      <React.Fragment>
        <div>
          <Formik
            component={component}
            initialValues={values}
            validationSchema={validationSchema}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default InputForm
