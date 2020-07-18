import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer  from './reducers'

// for multi middleware take them in array applyMiddleware( [thunk1, thunk2] )
export default createStore(rootReducer, applyMiddleware(thunk))