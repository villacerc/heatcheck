import React from 'react'
import classNames from 'classnames'
import { withCookies } from 'react-cookie'
import { navigate } from '@reach/router'
import { connect } from 'react-redux'

import { fetchVenues } from '../../actions'
import axios from '../../services/axios'
import logo from '../../assets/basketball.png'
import styles from './searchPage.module.scss'

class Search extends React.Component {
  state = {
    query: '',
    searching: false
  }

  componentDidMount() {
    const node = document.getElementById('searchField')

    node.addEventListener('keyup', async event => {
      if (event.key === 'Enter') {
        this.performSearch()
      }
    })
  }

  performSearch = async () => {
    if (!this.state.query || this.state.searching) return

    this.setState({ searching: true })

    const { cookies } = this.props

    const res = await axios.post('/api/search', {
      location: this.state.query
    })

    const { venues } = res.data

    const { locality, area, country } = venues[0]

    cookies.set('location', {
      locality,
      area,
      country
    })
    navigate('/')
    setTimeout(() => {
      this.props.fetchVenues({ locality, area, country })
    }, 4000)
    setTimeout(() => {
      this.props.fetchVenues({ locality, area, country })
    }, 8000)
  }

  setQuery = async e => {
    this.setState({ query: e.target.value })
  }

  render() {
    return (
      <div className={styles.body}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <img src={logo} />
            <h1>Pick and Roll</h1>
          </div>
          <div>
            <h1 className={styles.info}>Search. Create. Join. Play.</h1>
          </div>
          <div className={styles.searchBox}>
            <input
              disabled={this.state.searching}
              id="searchField"
              value={this.state.query}
              onChange={this.setQuery}
              type="text"
              placeholder="Type in a location..."
            />
            {this.state.searching ? (
              <i
                style={{ cursor: 'default' }}
                className={classNames(
                  'fas fa-sync fa-spin',
                  styles.searchButton
                )}
              ></i>
            ) : (
              <i
                onClick={this.performSearch}
                className={classNames('fas fa-search', styles.searchButton)}
              ></i>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default withCookies(connect(null, { fetchVenues })(Search))
