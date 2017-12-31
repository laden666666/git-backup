'use babel';
import React from 'react';
import {connect} from 'react-redux';
import { Button } from 'antd';
import {EditGitRepertory} from './EditGitRepertory'

class FooterBtns extends React.Component{
    state = {
        //显示创建新仓库
        showEditGitRepertory: false,
    }

    constructor(props){
        super(props)
    }

    //创建GitRepertory表单相关
    //显示创建表单
    handleEditGitRepertory = ()=>{
        this.setState({
            showEditGitRepertory: true
        })
    }
    //保存GitRepertory
    handleEditGitRepertoryOk = gitRepertory=>{
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

export default connect(null)(FooterBtns)