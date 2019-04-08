import axios from 'axios'

export const fetchVenues = () => async dispatch => {
  const res = await axios.get('/api/venues')

  dispatch({ type: 'RECEIVE_VENUES', payload: res.data.venues })
}
