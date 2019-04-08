import { combineReducers, createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'

import venuesReducer from './venuesReducer'

const reducers = combineReducers({
  venues: venuesReducer
})

const store = createStore(reducers, applyMiddleware(reduxThunk))

export default store
