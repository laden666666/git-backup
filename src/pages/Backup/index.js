import React from 'react';
import { Modal, Button, message, Spin, Collapse, List, Progress} from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import backupGitService from '../../service/backupGitService'
import BackupForm from './BackupForm'

const {dialog} = require('electron').remote

import selector from './selector';

const Panel = Collapse.Panel;

class Backup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            //备份的步骤：1.配置阶段 2.备份阶段
            step: 1,
            //是否取消备份。当处于备份阶段时候，用户点返回，不会立刻返回，而是将isCanceling置为true
            isCanceling: false,
            //备份完成的id列表
            complateReceiveIDList: [],
            //备份失败的id列表
            failReceiveList: [],
            //当前正在备份的id
            isBackupingId: 0,
        }
    }

    componentWillReceiveProps(nextProps, nextContext){
        if(nextProps.backupingRepertoryList != this.props.backupingRepertoryList){
            this.setState({
                step: 1,
                isCanceling: false,
                complateReceiveIDList: [],
                failReceiveList: [],
                isBackupingId: 0,
            })
        }
    }

    handleOk = () =>{
        var {complateReceiveIDList, failReceiveList} = this.state

        this.refs.backupForm.validateFields(async (err, values) => {
            if (!err) {
                console.log(values)
                this.setState({
                    step: 2
                })

                await backupGitService.backupRepertoryList(this.props.backupingRepertoryList, values.decorator, {
                    onStepFinish : (repertory)=>{
                        console.log('成功备份'+ repertory.name)
                        this.setState({
                            complateReceiveIDList: [...this.state.complateReceiveIDList, repertory.id]
                        })
                    },
                    onStepFail : (repertory)=>{
                        console.log('失败备份'+ repertory.name)
                        this.setState({
                            failReceiveList: [...this.state.failReceiveList, {id: repertory.id, name: repertory.name}]
                        })
                    },
                    onStep : (repertory)=>{
                        this.setState({
                            isBackupingId: repertory.id
                        })
                    },
                    useZip : values.useZip, 
                    hasTimeStamp : values.hasTimeStamp
                })

                if(this.state.failReceiveList.length){
                    Modal.error({
                        title: '备份完成',
                        content: [`${this.state.complateReceiveIDList.length ? 
                            `成功备份${this.state.complateReceiveIDList.length}条` : '' }`, `${
                                this.state.failReceiveList.length ? `失败备份${
                                    this.state.failReceiveList.length}条(${this.state.failReceiveList.map(({name})=>name).join('，')})` : '' }`].join('\n'),
                    })
                } else {
                    //如果没有错误，用info提示
                    message.info(`备份完成${this.state.complateReceiveIDList.length ? 
                        `，成功备份${this.state.complateReceiveIDList.length}条` : '' }`)
                }
                
               
                backupGitService.closeBackup()
            }
        });
    }
    
    handleCancel = () =>{
        backupGitService.closeBackup()
    }

    render() {
        const { visible, backupingRepertoryList } = this.props;
        const { step } = this.state;
        
        const fields = this.state.fields;

        var btns = []

        switch(step){
            case(1):
                btns = [
                    <Button key="back" onClick={this.handleCancel}>返回</Button>,
                    <Button key="submit" loading={this.state.loading} type="primary" onClick={this.handleOk}>
                        开始备份
                    </Button>,
                ]
                break
            case(2):
                btns = [
                ]
                break
                
        }

        return (
            <Modal
                maskClosable={false}
                destroyOnClose
                visible={visible}
                title="备份"
                closable={step != 2}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={btns}
            >
                    <Collapse bordered={false} defaultActiveKey={[]}>
                        <Panel header={`已选择备份${backupingRepertoryList.length}个仓库`} key="1">
                        <List
                            dataSource={backupingRepertoryList}
                            renderItem={item => (<List.Item>{item.name}({item.repertoryURL})</List.Item>)}
                        />
                        </Panel>
                    </Collapse>
                    {step == 1 && <BackupForm ref='backupForm'/>}
                    {step == 2 && (
                        <div>
                            
                            <Spin tip="正在备份仓库..." spinning={true}>
                                <div style={{height: 50}}></div>
                            </Spin>
                            <div>成功完成{this.state.complateReceiveIDList.length}个</div>
                            <div>失败完成{this.state.failReceiveList.length}个 <span style={{'color': 'red'}}>{this.state.failReceiveList.map(({name})=>name).join('，')}</span></div>
                            
                            <Progress percent={Math.floor( 100 * (this.state.complateReceiveIDList.length 
                                + this.state.failReceiveList.length) / this.props.backupingRepertoryList.length)} status="active" />
                        </div>
                    )}
            </Modal>
        );
    }
}

export default connect(selector)(Backup)
