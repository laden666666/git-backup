import {createSelector, createStructuredSelector} from 'reselect'

const visible = state => {
    return state.backup.visible
}
const backupingRepertoryList = state=> {
    return state.backup.backupingRepertoryList
}

export default createStructuredSelector({
    visible,
    backupingRepertoryList
});