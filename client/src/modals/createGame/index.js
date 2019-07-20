import React from 'react'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Formik } from 'formik'

import TextInput from '../../components/textInput'
import validationSchema from './validationSchema'
import axios from '../../services/axios'
import { popModal, fetchUser, fetchGames } from '../../actions'

class CreateGame extends React.Component {
  state = {
    submitting: false
  }
  submit = async values => {
    this.setState({ submitting: true })

    const res = await axios.post('/api/create-game', values)

    if (res.status === 200) {
      await this.props.fetchUser()
      if (this.props.successCallback) await this.props.successCallback()
      this.setState({ submitting: false })
      this.props.popModal()
      navigate('/game')
    }
  }
  handleClose = () => {
    this.props.popModal()
  }
  render() {
    const values = {
      name: '',
      description: '',
      venueId: this.props.venueId
    }

    return (
      <Dialog open={true} onClose={this.handleClose}>
        <Formik
          initialValues={values}
          onSubmit={this.submit}
          validationSchema={validationSchema}
          render={props => {
            return (
              <form onSubmit={props.handleSubmit}>
                <DialogTitle>Create Game</DialogTitle>
                <DialogContent>
                  <TextInput name="name" autoFocus label="Name" {...props} />
                  <TextInput
                    name="description"
                    label="Description"
                    multiline
                    rows="4"
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
  { popModal, fetchUser, fetchGames }
)(CreateGame)
