import {repertoryListTypes} from '../../constants/ActionTypes'
import constants from '../../constants'
const initialState = {
    //列表数据
    list: [],
    filterText: '',
    selectedLabelKey: constants.SYSTEM_ALL_LABELS,
    selectedIDs: [],
    loading: true
}

export default function repertoryList(state = initialState, {type, payload}) {
    switch (type) {
        case repertoryListTypes.SELECT_GIT_REPERTORY:
            //判断被选的标签是否已经被全部移除掉了，如果是将标签重置为全部标签
            var labelMap = {}
            payload.forEach(({labels})=>labels.forEach(label=>labelMap[label] = ''))
            var selectedLabelKey = labelMap[state.selectedLabelKey] == undefined ? constants.SYSTEM_ALL_LABELS : state.selectedLabelKey

            return {
                ...state,
                selectedLabelKey: selectedLabelKey,
                list: [...payload],
                loading: false
            }
        case repertoryListTypes.LOADING_GIT_REPERTORY:
            return {
                ...state,
                loading: true
            }
        case repertoryListTypes.CHANGE_SELECTED_ROW_KEYS:
            return {
                ...state,
                selectedIDs: [...payload],
            }
        case repertoryListTypes.CHANGE_FILTER_TEXT:
            return {
                ...state,
                filterText: payload,
                selectedIDs: [],
            }
        case repertoryListTypes.CHANGE_SELECTED_LABEL_KEY:
            return {
                ...state,
                selectedLabelKey: payload,
                selectedIDs: [],
            }
        default:
            return state
    }
}
