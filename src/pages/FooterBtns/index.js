'use babel';
import React from 'react';
import {connect} from 'react-redux';
import { Button, Modal } from 'antd';
import { showEditGitRepertory, getUsableSelectedIDs, deleteGitRepertorys, showImportGitRepertory } from '../../service/gitRepertoryService';

const confirm = Modal.confirm;

class FooterBtns extends React.Component{
    constructor(props){
        super(props)
    }

    //创建GitRepertory表单相关
    //显示创建表单
    handleCreateGitRepertory = ()=>{
        showEditGitRepertory()
    }
    handleImportGitRepertory = ()=>{
        showImportGitRepertory()
    }

    //删除多个资源
    handleDeleteGitRepertories = async ()=>{
        const ids = getUsableSelectedIDs()

        if(ids.length == 0){
            Modal.error({
                title: '错误',
                content: '请至少勾选一条记录！',
            });
            return
        }

        let result = await new Promise((resolve, reject)=>{
            confirm({
                title: '您确定要删除这些记录吗?',
                content: '该操作仅删除本地记录信息，不会删除该记录的备份数据和远程仓库',
                cancelText: '取消',
                okText: '确定',
                onOk() {
                    resolve(true);
                },
                onCancel() {
                    resolve(false);
                },
            })
        })

        if(result){
            await deleteGitRepertorys(ids)
        }
    }

    render(){
        return (<div className="footer">
            <Button type="primary">备份</Button>

            <div className="right-btns">
                <Button type="primary" onClick={this.handleDeleteGitRepertories}>删除</Button>
                <Button type="primary" onClick={this.handleCreateGitRepertory}>新建
                </Button>
                <Button type="primary" onClick={this.handleImportGitRepertory}>导入</Button>
            </div>
        </div>);
    }
}

export default connect(null)(FooterBtns)