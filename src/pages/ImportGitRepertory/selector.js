import {createSelector, createStructuredSelector} from 'reselect'

const importVisible = state => {
    return state.editRepertory.importVisible
}
export default createStructuredSelector({
    importVisible,
});