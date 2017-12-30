import {repertoryListTypes} from '../constants/ActionTypes'
const initialState = []

export default function repertoryList(state = initialState, {type, payload}) {
    switch (type) {
        case repertoryListTypes.ADD_GIT_REPERTORY:
            return [
                ...state,
                payload
            ]

        case repertoryListTypes.DELETE_GIT_REPERTORY:
            return state.filter(repertory =>
                repertory.id !== payload
            )

        case repertoryListTypes.EDIT_GIT_REPERTORY:
            return state.map(repertory =>
                repertory.id === payload.id ?
                    { ...payload } :
                    repertory
            )

        case repertoryListTypes.ADD_GIT_REPERTORY_LABEL:
            const {id, label} = payload
            return state.map(repertory =>{
                if(repertory.id === id && !~repertory.labels.indexOf(label)){
                    repertory.labels.push(label)
                }
                return repertory
            })

        case repertoryListTypes.DELETE_GIT_REPERTORY_LABEL:
            const {id, label} = payload
            return state.map(repertory =>{
                if(repertory.id === id){
                    repertory = {...repertory, labels: repertory.labels.filter(label=>label !== label)}
                }
                return repertory
            })
        default:
            return state
    }
}
