'use babel';
import React from 'react';
import { Button } from 'antd';
import {EditGitRepertory} from './EditGitRepertory'

export default class FooterBtns extends React.Component{
    state = {
        //显示创建新仓库
        showEditGitRepertory: false,
    }

    constructor(props){
        super(props)
        this.a = 111
    }

    //创建GitRepertory表单相关
    //显示创建表单
    handleEditGitRepertory = ()=>{
        this.setState({
            showEditGitRepertory: true
        })
    }
    //保存GitRepertory
    handleEditGitRepertoryOk = ()=>{
        this.setState({
            showEditGitRepertory: false
        })
    }
    //关闭表单
    handleEditGitRepertoryCancel = ()=>{
        this.setState({
            showEditGitRepertory: false
        })
    }

    render(){
        return (<div className="footer">
            <Button type="primary">备份{this.state.showEditGitRepertory + ''}</Button>

            <div className="right-btns">
                <Button type="primary">修改</Button>
                <Button type="primary">删除</Button>
                <Button type="primary" onClick={this.handleEditGitRepertory}>新建
                </Button>
                <Button type="primary">导入</Button>
            </div>

            {/*创建GitRepertory表单*/}
            <EditGitRepertory visible={this.state.showEditGitRepertory}
                onOk={this.handleEditGitRepertoryOk}
                onCancel={this.handleEditGitRepertoryCancel}
            ></EditGitRepertory>
        </div>);
    }
}