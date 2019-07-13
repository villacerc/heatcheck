export default function(state = { fetching: true, payload: null }, action) {
  switch (action.type) {
    case 'FETCHING_USER':
      return { ...state, fetching: true }
    case 'UPDATE_USER':
      return { ...state, payload: action.payload, fetching: false }
    default:
      return state
  }
}
