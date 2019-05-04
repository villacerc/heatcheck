import { combineReducers, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import reduxThunk from 'redux-thunk'

import venues from './venues'
import modals from './modals'
import user from './user'

const reducers = combineReducers({
  venues,
  modals,
  user
})

const store = createStore(reducers, applyMiddleware(reduxThunk, logger))

export default store
