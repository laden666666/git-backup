import {createSelector, createStructuredSelector} from 'reselect'

const labels = state => {
    const repertoryList = state.repertoryList.list
    var labelsMap = {}
    repertoryList.forEach(({labels})=>{
        labels.forEach(label=>{
            labelsMap[label] = ''
        })
    })
    return Object.keys(labelsMap).sort()
}


export default createStructuredSelector({
    labels
});