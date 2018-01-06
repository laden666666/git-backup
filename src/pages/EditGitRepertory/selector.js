import {createSelector, createStructuredSelector} from 'reselect'

const visible = state => {
    return state.editRepertory.visible
}
const editRepertory = state => {
    return state.editRepertory.editRepertory
}

export default createStructuredSelector({
    editRepertory,
    visible
});