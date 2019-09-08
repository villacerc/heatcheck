import React from 'react'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import axios from '../services/axios'
import { fetchGame, updateUser } from '../actions'

import styles from './gameItem.module.scss'

class GameItem extends React.Component {
  acceptInvite = async () => {
    const res = await axios.post('/api/accept-invite', {
      userId: this.props.user.id,
      gameId: this.props.game.id
    })

    if (res.status === 200) {
      this.props.updateUser()
    }
  }
  render() {
    const { game } = this.props
    return (
      <div>
        <Card className={styles.card}>
          <p style={{ fontWeight: 100 }}>{game.creator.displayName}</p>
          <div className={styles.title}>
            <p>{game.name}</p>
            <Button onClick={this.acceptInvite}>Accept</Button>
          </div>
          <p>{game.description}</p>
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
  { fetchGame, updateUser }
)(GameItem)
