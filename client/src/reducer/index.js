import { combineReducers, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import reduxThunk from 'redux-thunk'

import venues from './venues'
import modals from './modals'
import user from './user'
import game from './game'
import games from './games'
import googleMap from './googleMap'
import sideMenu from './sideMenu'

const reducers = combineReducers({
  venues,
  modals,
  user,
  game,
  games,
  googleMap,
  sideMenu
})

let middleware = []

if (process.env.NODE_ENV === 'development') {
  middleware = [reduxThunk, logger]
} else {
  middleware = [reduxThunk]
}

const store = createStore(reducers, applyMiddleware(...middleware))

export default store
