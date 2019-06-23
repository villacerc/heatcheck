import React from 'react'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'

import axios from '../services/axios'
import { fetchGame } from '../actions'

import styles from './playerItem.module.scss'

class PlayerItem extends React.Component {
  invitePlayer = async () => {
    const { player, gameId } = this.props

    const res = await axios.post('/api/invite-player', {
      playerId: player.id,
      gameId
    })

    if (res.status == 200) {
      this.props.fetchGame()
    }
  }

  renderActions = () => {
    const { invited, inviting, joining } = this.props
    if (invited) return null

    if (inviting)
      return (
        <React.Fragment>
          <CircularProgress style={{ marginLeft: 'auto' }} size={20} />
          <Button className={styles.cancelInvite}>
            <Icon>close</Icon>
          </Button>
        </React.Fragment>
      )

    if (joining) {
      return <Button>Accept</Button>
    }

    return <Button onClick={this.invitePlayer}>Invite</Button>
  }

  render() {
    const { player, joining } = this.props
    return (
      <div>
        {joining && <p className={styles.status}>Wants to join!</p>}
        <Card className={styles.card}>
          <Avatar className={styles.avatar} />
          <div className={styles.content}>
            <div className={styles.body}>
              <p>{player.displayName}</p>
            </div>
            {this.renderActions()}
          </div>
        </Card>
      </div>
    )
  }
}

export default connect(
  null,
  { fetchGame }
)(PlayerItem)
