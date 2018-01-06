import { combineReducers, createStore } from 'redux'
import repertoryList from './reducers/repertoryList'
import editRepertory from './reducers/editRepertory'

const store = createStore(combineReducers({
    repertoryList, editRepertory
}))

export default store
