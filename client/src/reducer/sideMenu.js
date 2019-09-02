export default function(state = { isVisible: null }, action) {
  switch (action.type) {
    case 'SET_SIDEMENU_IS_VISIVBLE':
      return { ...state, isVisible: action.payload }
    default:
      return state
  }
}
