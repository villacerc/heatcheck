import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import { Link } from '@reach/router'

import styles from './notFound.module.scss'

class NotFound extends React.Component {
  render() {
    return (
      <div>
        <Paper classes={{ root: styles.paper }}>
          <div className={styles.content}>
            <h2>Page not found :(</h2>
            <p>
              Maybe the page you are looking for has been removed, or you typed
              in the wrong URL
            </p>
          </div>

          <Divider />
          <div className={styles.footer}>
            <Link to="/">
              <Button color="primary"> home </Button>
            </Link>
          </div>
        </Paper>
      </div>
    )
  }
}
export default NotFound
