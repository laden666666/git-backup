import {repertoryListTypes} from '../store/constants/ActionTypes'
import store from '../store'

export const selectGitRepertory = gitRepertorys => store.dispatch({
    type: repertoryListTypes.ADD_GIT_REPERTORY,
    payload: gitRepertory
})
export const addGitRepertory = gitRepertory => store.dispatch({
    type: repertoryListTypes.ADD_GIT_REPERTORY,
    payload: gitRepertory
})
export const deleteGitRepertory = id => store.dispatch({
    type: repertoryListTypes.DELETE_GIT_REPERTORY,
    payload: id
})
export const editGitRepertory = gitRepertory => store.dispatch({
    type: repertoryListTypes.EDIT_GIT_REPERTORY,
    payload: gitRepertory
})
