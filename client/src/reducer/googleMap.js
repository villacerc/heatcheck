export default function(state = { selectedVenue: {}, center: null }, action) {
  switch (action.type) {
    case 'SET_MAP_CENTER':
      const { lat, lng } = action.payload
      return { ...state, center: { lat, lng } }
    case 'SET_SELECTED_VENUE':
      return { ...state, selectedVenue: action.payload }
    default:
      return state
  }
}
