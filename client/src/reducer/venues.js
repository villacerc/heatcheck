export default function(state = null, action) {
  switch (action.type) {
    case 'RECEIVE_VENUES':
      return action.payload
    default:
      return state
  }
}
