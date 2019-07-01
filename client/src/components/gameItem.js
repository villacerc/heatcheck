import React from 'react'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import axios from '../services/axios'
import { fetchGame, fetchUser } from '../actions'

import styles from './gameItem.module.scss'

class GameItem extends React.Component {
  acceptInvite = async () => {
    const res = await axios.post('/api/accept-invite', {
      userId: this.props.user.id,
      gameId: this.props.game.id
    })

    if (res.status == 200) {
      this.props.fetchUser()
    }
  }
  render() {
    const { game } = this.props
    return (
      <div>
        <p className={styles.status}>
          {game.creator.displayName} has invited you!
        </p>
        <Card className={styles.card}>
          <div className={styles.content}>
            <p>{game.name}</p>
            <Button onClick={this.acceptInvite}>Accept</Button>
          </div>
        </Card>
      </div>
    )
  }
}

const reduxStates = ({ user }) => {
  return { user: user.payload }
}

export default connect(
  reduxStates,
  { fetchGame, fetchUser }
)(GameItem)
