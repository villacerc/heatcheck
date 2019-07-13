import axios from 'axios'

export const fetchVenues = () => async dispatch => {
  const res = await axios.get('/api/venues')

  dispatch({ type: 'RECEIVE_VENUES', payload: res.data.venues })
}

export const fetchGames = () => async dispatch => {
  const res = await axios.get('/api/games')

  dispatch({ type: 'RECEIVE_GAMES', payload: res.data.games })
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

export const fetchGame = state => async dispatch => {
  dispatch({ type: 'FETCHING_GAME' })

  const res =
    state === 'joined'
      ? await axios.get('/api/joined-game')
      : await axios.get('/api/my-game')

  if (res.status == 200) {
    dispatch({ type: 'RECEIVE_GAME', payload: res.data.game })
  }
}
