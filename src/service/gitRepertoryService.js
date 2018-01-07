import {repertoryListTypes, editRepertoryTypes} from '../constants/ActionTypes'
import constants from '../constants/'
import store from '../store'
import {getGitRepertoryCollection} from '../db'

/**
 * 从数据库中检索出最新GitRepertory数据
 * @param showLoading           是否显示加载动画
 * @returns {Promise.<void>}
 */
export const selectGitRepertory = async (showLoading = true) => {
    if(showLoading){
        store.dispatch({
            type: repertoryListTypes.LOADING_GIT_REPERTORY
        })
    }

    store.dispatch({
        type: repertoryListTypes.SELECT_GIT_REPERTORY,
        payload: (await getGitRepertoryCollection()).chain().data()
    })
}

/**
 * 创建gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param gitRepertory
 * @returns {Promise.<void>}
 */
export const addGitRepertory = async gitRepertory => {
    (await getGitRepertoryCollection()).insert(gitRepertory)
    await selectGitRepertory(false)
}

/**
 * 创建多个gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param gitRepertorys
 * @returns {Promise.<void>}
 */
export const addGitRepertorys = async gitRepertorys => {
    var collection = await getGitRepertoryCollection()
    for(let i = 0; i < gitRepertorys.length; i++){
        var gitRepertory = gitRepertorys[i]
        collection.insert(gitRepertory)
    }
    await selectGitRepertory(false)
}

/**
 * 删除gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param id
 * @returns {Promise.<void>}
 */
export const deleteGitRepertory = async id => {
    (await getGitRepertoryCollection()).chain().find({id}).remove()
    await selectGitRepertory(false)
}

/**
 * 删除多条gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param ids
 * @returns {Promise.<void>}
 */
export const deleteGitRepertorys = async ids => {
    (await getGitRepertoryCollection()).chain().find({ 'id' : { '$in' : ids } }).remove()
    await selectGitRepertory(false)
}

/**
 * 编辑gitRepertory对象，并保存到数据库中。然后刷新store中的列表数据
 * @param gitRepertory
 * @returns {Promise.<void>}
 */
export const editGitRepertory = async gitRepertory => {
    var repertoryCollection = await getGitRepertoryCollection()
    var _gitRepertory = repertoryCollection.chain().find({id: gitRepertory.id}).data()[0]
    _gitRepertory = {..._gitRepertory, ...gitRepertory}
    repertoryCollection.update(_gitRepertory)
    await selectGitRepertory(false)
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
 * 获得当前有效的被选记录id
 */
export const getUsableSelectedRepertory = async () => {
    var ids = getUsableSelectedIDs()
    var repertoryCollection = await getGitRepertoryCollection()
    return repertoryCollection.chain().data().filter(repertory=>ids.indexOf(repertory.id) > -1)
}

/**
 * 获得当前有效的被选记录id
 */
export const getUsableSelectedIDs = () => {
    const { list, filterText, selectedIDs, selectedLabelKey } = store.getState().repertoryList
    const usableIDs = filterGitRepertoryList(list, filterText, selectedLabelKey).map((repertory) => repertory.id);
    return selectedIDs.filter(id=>!!~usableIDs.indexOf(id))
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
 * 更改列表的可选标签
 * @param labelKey
 */
export const changeSelectedLabelKey = labelKey => {
    store.dispatch({
        type: repertoryListTypes.CHANGE_SELECTED_LABEL_KEY,
        payload: labelKey
    })
}

/**
 * 根据检索词过滤列表数据，该方法不修改store中的列表数据
 * @param filterText
 */
export const filterGitRepertoryList = (repertoryList, filterText, selectedLabelKey='') => {
    return repertoryList.filter(gitRepertory=>{
        return (~gitRepertory.name.indexOf(filterText)
            || ~gitRepertory.repertoryURL.indexOf(filterText)
            || gitRepertory.labels.filter(label=>~label.indexOf(filterText)).length)
            && (selectedLabelKey === constants.SYSTEM_ALL_LABELS
            || !!~gitRepertory.labels.indexOf(selectedLabelKey))
    })
}

/**
 * 打开编辑对话框，编辑仓库
 * @param gitRepertory
 */
export const showEditGitRepertory = (gitRepertory = null) => {
    store.dispatch({
        type: editRepertoryTypes.SHOW_GIT_REPERTORY,
        payload: gitRepertory
    })
}
/**
 * 关闭编辑对话框
 */
export const closeEditGitRepertory = () => {
    store.dispatch({
        type: editRepertoryTypes.HIDE_GIT_REPERTORY,
        payload: {}
    })
}

/**
 * 打开导入对话框，导入仓库
 */
export const showImportGitRepertory = () => {
    store.dispatch({
        type: editRepertoryTypes.SHOW_IMPORT_REPERTORY,
    })
}
/**
 * 关闭导入对话框
 */
export const closeImportGitRepertory = () => {
    store.dispatch({
        type: editRepertoryTypes.HIDE_IMPORT_REPERTORY,
    })
}

/**
 * 检验工程名是否唯一
 * @param gitRepertory
 * @returns {Promise.<void>}
 */
export const checkGitRepertoryName = async (id, name) => {
    var repertoryCollection = await getGitRepertoryCollection()
    var _gitRepertory = repertoryCollection.chain().find({name: name, id: { '$ne' : id }}).data()[0]
    return !_gitRepertory
}

/**
 * 获得所有工程名
 * @returns {Promise.<string[]>}
 */
export const getAllGitRepertoryName = async () => {
    var repertoryCollection = await getGitRepertoryCollection()
    return repertoryCollection.chain().data().map(repertory=>repertory.name)
}