import React from 'react'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import CircularProgress from '@material-ui/core/CircularProgress'

import styles from './playerItem.module.scss'

export default function(props) {
  const { player } = props
  return (
    <Card className={styles.card}>
      <Avatar className={styles.avatar} />
      <div className={styles.content}>
        {player.displayName}
        {player.Request.type && (
          <div className={styles.actions}>
            <Button>
              <Icon>done</Icon>
            </Button>
            {/* <CircularProgress style={{ marginLeft: 'auto' }} size={20} />
          <Button style={{ marginLeft: '10px' }}>
            <Icon className={styles.cancelInvite}>close</Icon>
          </Button> */}
          </div>
        )}
      </div>
    </Card>
  )
}
