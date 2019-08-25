import React from 'react'
import queryString from 'query-string'
import { navigate } from '@reach/router'
import { connect } from 'react-redux'

import { showModal, fetchUser } from '../../actions'
import NotFound from '../notFound'
import axios from '../../services/axios'

class Verify extends React.Component {
  state = {
    status: null
  }

  componentDidMount() {
    this.verify()
  }

  verify = async () => {
    const query = queryString.parse(this.props.location.search)
    if (query.token) {
      const res = await axios.post('/api/verify', query)
      if (res.status === 200) {
        await this.props.fetchUser()
        await navigate('/')
        this.props.showModal('dialog', {
          body: 'Your email has been succesfully verified!'
        })
      } else {
        this.setState({ status: 'invalid' })
      }
    } else {
      this.setState({ status: 'invalid' })
    }
  }

  content = () => {
    switch (this.state.status) {
      case 'invalid':
        return <NotFound />
      default:
        return null
    }
  }

  render() {
    return this.content()
  }
}

export default connect(
  null,
  { showModal, fetchUser }
)(Verify)
