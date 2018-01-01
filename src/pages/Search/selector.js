import {createSelector, createStructuredSelector} from 'reselect'
const filterText = state => state.repertoryList.filterText

export default createStructuredSelector({
    filterText
});