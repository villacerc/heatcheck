import React from 'react'
import { Link } from '@reach/router'
import classNames from 'classnames'

import logo from '../../assets/basketball.png'
import styles from './searchPage.module.scss'

class Search extends React.Component {
  render() {
    return (
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <img src={logo} />
            <h1>Pick and Roll</h1>
          </div>
          <div>
            <h1 className={styles.info}>Search. Create. Join. Play</h1>
          </div>
          <div className={styles.searchBox}>
            <input type="text" placeholder="Type in a location..." />
            <i className={classNames('fas fa-search', styles.searchButton)}></i>
          </div>
        </div>
      </div>
    )
  }
}

export default Search
