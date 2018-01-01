import {repertoryListTypes} from '../constants/ActionTypes'
const initialState = {
    list: [],
    filterText: '',
    selectedIDs: [],
    loading: true
}

export default function repertoryList(state = initialState, {type, payload}) {
    switch (type) {
        case repertoryListTypes.SELECT_GIT_REPERTORY:
            return {
                ...state,
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
            }
        default:
            return state
    }
}
