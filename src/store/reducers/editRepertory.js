import {editRepertoryTypes} from '../../constants/ActionTypes'
import {GitRepertoryFactory} from '../../entity/GitRepertory'

const initialState = {
    //列表数据
    visible: false,
    importVisible: false,
    editRepertory: null
}

export default function repertoryList(state = initialState, {type, payload}) {
    switch (type) {
        case editRepertoryTypes.SHOW_GIT_REPERTORY:
            payload = payload ? {...payload} : null
            return {
                ...state,
                editRepertory: payload,
                visible: true
            }
        case editRepertoryTypes.HIDE_GIT_REPERTORY:
            return {
                ...state,
                visible: false
            }
        case editRepertoryTypes.SHOW_IMPORT_REPERTORY:
            return {
                ...state,
                importVisible: true
            }
        case editRepertoryTypes.HIDE_IMPORT_REPERTORY:
            return {
                ...state,
                importVisible: false
            }
        default:
            return state
    }
}
