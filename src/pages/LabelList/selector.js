import {createSelector, createStructuredSelector} from 'reselect'
import constants from '../../constants'

const labels = state => {
    const repertoryList = state.repertoryList.list
    var labelsMap = {}
    repertoryList.forEach(({labels})=>{
        labels.forEach(label=>{
            labelsMap[label] = !labelsMap.hasOwnProperty(label) ? 1 : labelsMap[label] + 1
        })
    })
    return [{label: `全部标签(${repertoryList.length})`, key: constants.SYSTEM_ALL_LABELS}, ...Object.keys(labelsMap)
        .map(label=>({label: `${label}(${labelsMap[label]})`, key: label}))
        .sort((label1, label2)=> label1.key > label2.key ? 1 : -1)]
}

const selectedLabelKey = state => {
    return state.repertoryList.selectedLabelKey
}

export default createStructuredSelector({
    labels,
    selectedLabelKey
});