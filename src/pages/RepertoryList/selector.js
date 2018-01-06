import {createSelector, createStructuredSelector} from 'reselect'
import {filterGitRepertoryList} from '../../service/gitRepertoryService'

const repertoryList = state => {
    const {list, filterText, selectedLabelKey} = state.repertoryList
    return filterGitRepertoryList(list, filterText, selectedLabelKey)
}
const loading = state => state.repertoryList.loading
const selectedIDs = state => state.repertoryList.selectedIDs

export default createStructuredSelector({
    repertoryList,
    selectedIDs,
    loading
});