export default function(state = { centeredVenue: {}, center: null }, action) {
  switch (action.type) {
    case 'SET_MAP_CENTER':
      const { lat, lng } = action.payload
      return { ...state, center: { lat, lng } }
    case 'SET_CENTERED_VENUE':
      return { ...state, centeredVenue: action.payload }
    default:
      return state
  }
}
