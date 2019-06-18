import axios from 'axios'

export const fetchVenues = () => async dispatch => {
  const res = await axios.get('/api/venues')

  dispatch({ type: 'RECEIVE_VENUES', payload: res.data.venues })
}

export const showModal = (name, props = null) => ({
  type: 'SHOW_MODAL',
  name,
  props
})

export const popModal = () => ({
  type: 'POP_MODAL'
})

export const clearModal = () => ({
  type: 'CLEAR_MODAL'
})

export const fetchUser = () => async dispatch => {
  dispatch({ type: 'FETCHING_USER' })

  const res = await axios.get('/api/user')

  dispatch(updateUser(res.data.user))
}

export const updateUser = payload => ({
  type: 'UPDATE_USER',
  payload
})
