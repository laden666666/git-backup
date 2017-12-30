import {repertoryListTypes} from '../constants/ActionTypes'

export const addGitRepertory = gitRepertory => ({
    type: repertoryListTypes.ADD_GIT_REPERTORY,
    payload: gitRepertory
})
export const deleteGitRepertory = id => ({
    type: repertoryListTypes.DELETE_GIT_REPERTORY,
    payload: id
})
export const editGitRepertory = gitRepertory => ({
    type: repertoryListTypes.EDIT_GIT_REPERTORY,
    payload: gitRepertory
})
