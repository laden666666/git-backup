import {repertoryListTypes} from '../constants/ActionTypes'
const initialState = []

export default function repertoryList(state = initialState, {type, payload}) {
    switch (type) {
        case repertoryListTypes.SELECT_GIT_REPERTORY:
            return [
                ...payload
            ]
        default:
            return state
    }
}
