import {createSelector, createStructuredSelector} from 'reselect'
const repertoryList = state => state.repertoryList

export default createStructuredSelector({
    repertoryList
});