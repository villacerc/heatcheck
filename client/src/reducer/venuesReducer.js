export default function(state = {}, action) {
  switch (action.type) {
    case 'RECEIVE_VENUES':
      return { ...state, ...action.payload }
    default:
      return state
  }
}
