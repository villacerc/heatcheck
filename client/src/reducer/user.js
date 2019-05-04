export default function(state = { fetching: false, payload: null }, action) {
  switch (action.type) {
    case 'FETCHING_USER':
      return { ...state, fetching: true }
    case 'RECEIVE_USER':
      return { ...state, payload: action.payload, fetching: false }
    default:
      return state
  }
}
