import { combineReducers, createStore } from 'redux'
import repertoryList from './reducers/repertoryList'
import editRepertory from './reducers/editRepertory'
import backup from './reducers/backup'

const store = createStore(combineReducers({
    repertoryList, editRepertory, backup
}))

export default store
