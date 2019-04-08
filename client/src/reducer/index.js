import { combineReducers, createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import venues from './venuesReducer'
import modals from './modalsReducer'

const reducers = combineReducers({
  venues,
  modals
})

const store = createStore(reducers, applyMiddleware(reduxThunk))

export default store
