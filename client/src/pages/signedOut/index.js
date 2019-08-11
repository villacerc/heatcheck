import React from 'react'
import Paper from '@material-ui/core/Paper'
import { Link, Redirect } from '@reach/router'
import { connect } from 'react-redux'

import { showModal } from '../../actions'

import styles from './signedOut.module.scss'

class SignedOut extends React.Component {
  render() {
    const { user } = this.props
    if (user.fetching) return null
    if (user.payload) return <Redirect to="/" noThrow />

    return (
      <div>
        <Paper classes={{ root: styles.paper }}>
          <div className={styles.content}>
            <h2>You are now signed out.</h2>
            <p>
              You can <Link to="/">return to the home page</Link> or{' '}
              <span
                onClick={() =>
                  this.props.showModal('login', {
                    location: this.props.location
                  })
                }
              >
                sign in again.
              </span>
            </p>
          </div>
        </Paper>
      </div>
    )
  }
}

const reduxStates = ({ user }) => {
  return {
    user
  }
}

export default connect(
  reduxStates,
  { showModal }
)(SignedOut)
