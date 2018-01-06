import {editRepertoryTypes} from '../../constants/ActionTypes'
import {GitRepertoryFactory} from '../../entity/GitRepertory'

const initialState = {
    //列表数据
    visible: false,
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
        default:
            return state
    }
}
