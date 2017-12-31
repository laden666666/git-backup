import {repertoryListTypes} from '../store/constants/ActionTypes'
import store from '../store'
import {gitRepertoryCollection} from '../db'

export const selectGitRepertory = async () => {
    store.dispatch({
        type: repertoryListTypes.SELECT_GIT_REPERTORY,
        payload: (await gitRepertoryCollection()).chain().data()
    })
}
export const addGitRepertory = async gitRepertory => {
    (await gitRepertoryCollection()).insert(gitRepertory)
    await selectGitRepertory()
}
export const deleteGitRepertory = async id => {
    (await gitRepertoryCollection()).chain().find({id}).remove()
    await selectGitRepertory()
}
export const editGitRepertory = async gitRepertory => {
    var _gitRepertory = (await gitRepertoryCollection()).chain().find({id}).data()[0]
    _gitRepertory = {..._gitRepertory, ...gitRepertory}
    (await gitRepertoryCollection()).update(_gitRepertory)
    await selectGitRepertory()
}
