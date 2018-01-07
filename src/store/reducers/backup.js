import {backupTypes} from '../../constants/ActionTypes'
import constants from '../../constants'
const initialState = {
    visible: false,
    backupingRepertoryList: [],
}

export default function backup(state = initialState, {type, payload}) {
    switch (type) {
        case backupTypes.HIDE_BACKUP:
            return {
                ...state,
                backupingRepertoryList: [],
                visible: false
            }
        case backupTypes.SHOW_BACKUP:
            return {
                ...state,
                backupingRepertoryList: [...payload],
                visible: true
            }
        default:
            return state
    }
}
