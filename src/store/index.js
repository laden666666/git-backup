import { combineReducers, createStore } from 'redux'
import repertoryList from './reducers/repertoryList'

const store = createStore(combineReducers({
    repertoryList
}))

export default store
