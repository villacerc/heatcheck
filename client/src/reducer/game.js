export default function(state = { retrieved: false, payload: null }, action) {
  switch (action.type) {
    case 'FETCHING_GAME':
      return { ...state, retrieved: false }
    case 'RECEIVE_GAME':
      return { ...state, payload: action.payload, retrieved: true }
    default:
      return state
  }
}
