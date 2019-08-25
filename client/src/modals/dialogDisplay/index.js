import React from 'react'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

import { popModal } from '../../actions'

import styles from './dialogDisplay.module.scss'

class DialogDisplay extends React.Component {
  state = {
    loading: false
  }
  handleCallback = async () => {
    this.setState({ loading: true })

    await this.types[this.props.type].callback()

    if (!this.props.disableCloseInCallback) {
      // turn popModal to a promise so it gets popped after callback finishes
      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 0)
      })
      this.props.popModal()
    }
  }
  confirmFooter = () => {
    return (
      <DialogActions>
        <Button
          disabled={this.state.loading}
          onClick={this.props.popModal}
          color="primary"
        >
          No
        </Button>
        <Button
          disabled={this.state.loading}
          color="primary"
          onClick={this.handleCallback}
        >
          Yes
        </Button>
      </DialogActions>
    )
  }
  defaultFooter = () => {
    return (
      <DialogActions>
        <Button onClick={this.props.popModal} color="primary">
          Continue
        </Button>
      </DialogActions>
    )
  }
  types = {
    confirmation: {
      callback: this.props.confirmCallback,
      footer: this.confirmFooter
    }
  }
  render() {
    return (
      <Dialog open={true}>
        <DialogContent>{this.props.body}</DialogContent>
        {this.props.type
          ? this.types[this.props.type].footer()
          : this.defaultFooter()}
      </Dialog>
    )
  }
}

export default connect(
  null,
  { popModal }
)(DialogDisplay)
