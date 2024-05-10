import React from 'react'
import classNames from 'classnames'
import { withCookies } from 'react-cookie'
import { navigate } from '@reach/router'
import { connect } from 'react-redux'

import { fetchVenues } from '../../actions'
import axios from '../../services/axios'
import logo from '../../assets/basketball.png'
import styles from './searchPage.module.scss'

import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const LOCATIONS = [
  {locality: "Vancouver", area: "BC", country: "Canada"}, 
  {locality: "Richmond", area: "BC", country: "Canada"},
  {locality: "Surrey", area: "BC", country: "Canada"},
  {locality: "Victoria", area: "BC", country: "Canada"}
]

class Search extends React.Component {
  state = {
    query: '',
    locationIndex: null,
    searching: false
  }

  componentDidMount() {
    // const node = document.getElementById('searchField')

    // node.addEventListener('keyup', async event => {
    //   if (event.key === 'Enter') {
    //     this.performSearch()
    //   }
    // })
  }

  handleSelect = (event) => {
    this.setState({ locationIndex: event.target.value });

    const { locality, area, country } = LOCATIONS[event.target.value]

    this.props.cookies.set('location', {
      locality,
      area,
      country
    })
    navigate('/venues')
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
            <h1 className={styles.info}>Your Guide to Nearby Hoops!</h1>
          </div>

          <FormControl variant="filled" className={styles.selectBox}>
          <InputLabel htmlFor="filled-age-simple">Select location</InputLabel>
          <Select
            value={this.state.locationIndex === null ? "" : this.state.locationIndex}
            style={{background: "white"}}
            onChange={this.handleSelect}
            input={<FilledInput name="location" id="filled-age-simple" />}
          >
            {LOCATIONS.map((location, index) => (
              <MenuItem key={index} value={index}>{`${location.locality}, ${location.area}`}</MenuItem>
            ))}
          </Select>
        </FormControl>

          {/* <div className={styles.searchBox}>
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
          </div> */}
        </div>
      </div>
    )
  }
}

export default withCookies(connect(null, { fetchVenues })(Search))
