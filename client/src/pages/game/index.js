import React from 'react'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

import PlayerItem from '../../components/playerItem'
import { showModal } from '../../actions'

import styles from './game.module.scss'

class Game extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>3on3 basketball @ Parker place</h1>
          <p>All welcome</p>
        </div>
        <Button
          onClick={() => this.props.showModal('invite players')}
          variant="contained"
          size="large"
          color="primary"
        >
          Invite Players
        </Button>
        <div className={styles.playerList}>
          <PlayerItem />
        </div>
      </div>
    )
  }
}

export default connect(
  null,
  { showModal }
)(Game)
