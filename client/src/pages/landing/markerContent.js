import React from 'react'
import Paper from '@material-ui/core/Paper'
import VenueInfo from './venueInfo'

import styles from './MarkerContent.module.scss'

class MarkerContent extends React.Component {
  render() {
    const { venue } = this.props
    return (
      <Paper className={styles.container}>
        <VenueInfo closePopper={this.props.closePopper} venue={venue} />
      </Paper>
    )
  }
}

export default MarkerContent
