import {createSelector, createStructuredSelector} from 'reselect'
import {filterGitRepertoryList} from '../../service/gitRepertoryService'

const repertoryList = state => {
    const filterText = state.repertoryList.filterText
    const list = state.repertoryList.list
    return filterGitRepertoryList(list, filterText)
}
const loading = state => state.repertoryList.loading
const selectedIDs = state => state.repertoryList.selectedIDs


export default createStructuredSelector({
    repertoryList,
    selectedIDs,
    loading
});