export default function(state = { stack: [] }, action) {
  const { stack } = state
  switch (action.type) {
    case 'SHOW_MODAL':
      const { name, props } = action
      stack.push({ name, props })
      return { ...state, stack }
    case 'POP_MODAL':
      stack.pop()
      return { ...state, stack }
    case 'CLEAR_MODAL':
      return { ...state, stack: [] }
    default:
      return state
  }
}
