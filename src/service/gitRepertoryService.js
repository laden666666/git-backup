import {repertoryListTypes} from '../store/constants/ActionTypes'
import store from '../store'
import {gitRepertoryCollection} from '../db'

/**
 * 从数据库中检索出最新GitRepertory数据
 * @param gitRepertory
 * @returns {Promise.<void>}
 */
export const selectGitRepertory = async () => {
    store.dispatch({
        type: repertoryListTypes.LOADING_GIT_REPERTORY
    })
    store.dispatch({
        type: repertoryListTypes.SELECT_GIT_REPERTORY,
        payload: (await gitRepertoryCollection()).chain().data()
    })
}

/**
 * 创建gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param gitRepertory
 * @returns {Promise.<void>}
 */
export const addGitRepertory = async gitRepertory => {
    (await gitRepertoryCollection()).insert(gitRepertory)
    await selectGitRepertory()
}

/**
 * 删除gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param id
 * @returns {Promise.<void>}
 */
export const deleteGitRepertory = async id => {
    (await gitRepertoryCollection()).chain().find({id}).remove()
    await selectGitRepertory()
}

/**
 * 删除多条gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param ids
 * @returns {Promise.<void>}
 */
export const deleteGitRepertorys = async ids => {
    (await gitRepertoryCollection()).chain().find({id}).remove()
    await selectGitRepertory()
}

/**
 * 编辑gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param gitRepertory
 * @returns {Promise.<void>}
 */
export const editGitRepertory = async gitRepertory => {
    var _gitRepertory = (await gitRepertoryCollection()).chain().find({id}).data()[0]
    _gitRepertory = {..._gitRepertory, ...gitRepertory}
    (await gitRepertoryCollection()).update(_gitRepertory)
    await selectGitRepertory()
}

/**
 * 更改列表的选择项id列表
 * @param SelectedIDs
 */
export const changeSelectedIDs = SelectedIDs => {
    store.dispatch({
        type: repertoryListTypes.CHANGE_SELECTED_ROW_KEYS,
        payload: SelectedIDs
    })
}

/**
 * 更改列表的检索词
 * @param filterText
 */
export const changeFilterText = filterText => {
    store.dispatch({
        type: repertoryListTypes.CHANGE_FILTER_TEXT,
        payload: filterText
    })
}

/**
 * 根据检索词过滤列表数据，该方法不修改store中的列表数据
 * @param filterText
 */
export const filterGitRepertoryList = (repertoryList, filterText) => {
    return repertoryList.filter(gitRepertory=>{
        return ~gitRepertory.name.indexOf(filterText)
            || ~gitRepertory.repertoryURL.indexOf(filterText)
            || gitRepertory.labels.filter(label=>~label.indexOf(filterText)).length
    })
}