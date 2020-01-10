import axios from 'axios'

export const fetchVenues = location => async dispatch => {
  const res = await axios.post('/api/get-venues', { location })

  dispatch({ type: 'RECEIVE_VENUES', payload: res.data.venues })
}

export const setSideMenuIsVisible = payload => async dispatch => {
  dispatch({ type: 'SET_SIDEMENU_IS_VISIVBLE', payload })
}

export const setMapCenter = (payload, showVenue = false) => async dispatch => {
  dispatch({ type: 'SET_MAP_CENTER', payload })

  if (showVenue) {
    dispatch(setSelectedVenue(payload))
  }
}

export const setSelectedVenue = payload => async dispatch => {
  dispatch({ type: 'SET_SELECTED_VENUE', payload })
}

export const fetchGames = location => async dispatch => {
  const res = await axios.post('/api/get-games', { location })

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

  const res = await axios.post('/api/get-user')

  dispatch({
    type: 'UPDATE_USER',
    payload: res.data.user
  })
}

export const updateUser = () => async dispatch => {
  const res = await axios.post('/api/get-user')

  dispatch({
    type: 'UPDATE_USER',
    payload: res.data.user
  })
}

export const fetchGame = gameId => async dispatch => {
  dispatch({ type: 'FETCHING_GAME' })

  const res = await axios.post('/api/get-game', { gameId })

  dispatch({ type: 'RECEIVE_GAME', payload: res.data.game })
}
