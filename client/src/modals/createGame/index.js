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
import { popModal } from '../../actions'

class CreateGame extends React.Component {
  state = {
    submitting: false
  }
  submit = async values => {
    this.setState({ submitting: true })
    const res = await axios.post('/api/create-game', values)

    if (res.status === 200) {
      navigate('/game')
    }

    this.setState({ submitting: false })
  }
  handleClose = () => {
    this.props.popModal()
  }
  render() {
    const values = {
      name: '',
      descriptions: ''
    }

    return (
      <Dialog open={true} onClose={this.handleClose}>
        <Formik
          initialValues={values}
          onSubmit={this.submit}
          validationSchema={validationSchema}
          render={props => {
            const {
              values: { name, description },
              errors,
              touched,
              handleChange,
              isValid,
              handleBlur,
              handleSubmit
            } = props

            return (
              <form onSubmit={handleSubmit}>
                <DialogTitle>Create Game</DialogTitle>
                <DialogContent>
                  <TextField
                    id="name"
                    name="name"
                    autoFocus
                    helperText={touched.name ? errors.name : ''}
                    error={touched.name && Boolean(errors.name)}
                    label="Name"
                    value={name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                  <TextField
                    id="description"
                    name="description"
                    helperText={touched.description ? errors.description : ''}
                    error={touched.description && Boolean(errors.description)}
                    label="Description"
                    fullWidth
                    multiline
                    rows="4"
                    value={description}
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
  { popModal }
)(CreateGame)
