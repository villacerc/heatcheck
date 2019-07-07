export default function(state = null, action) {
  switch (action.type) {
    case 'RECEIVE_GAMES':
      return action.payload
    default:
      return state
  }
}
