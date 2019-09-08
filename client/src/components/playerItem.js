import React from 'react'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import classNames from 'classnames'

import axios from '../services/axios'
import { fetchGame } from '../actions'

import styles from './playerItem.module.scss'

class PlayerItem extends React.Component {
  handleRequest = async request => {
    const { player, gameId } = this.props

    const route = request === 'invite' ? 'invite-player' : 'accept-join-request'

    const res = await axios.post(`/api/${route}`, {
      userId: player.id,
      gameId
    })

    if (res.status === 200) {
      this.props.fetchGame(gameId)
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
      return <Button onClick={() => this.handleRequest('join')}>Accept</Button>
    }

    return <Button onClick={() => this.handleRequest('invite')}>Invite</Button>
  }

  render() {
    const { player, isGameCreator } = this.props
    return (
      <div>
        <Card>
          <div className={styles.content}>
            <Avatar
              style={{ background: player.color }}
              className={styles.avatar}
            >
              {player.displayName.charAt(0).toUpperCase()}
            </Avatar>
            <div className={styles.body}>
              <div className={styles.info}>
                <p>
                  {isGameCreator && (
                    <i
                      className={classNames(styles.leader, 'fas fa-crown')}
                    ></i>
                  )}
                  {player.displayName}
                </p>
              </div>
              {this.renderActions()}
            </div>
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
