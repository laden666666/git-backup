'use babel';
import React from 'react';
import { connect } from 'react-redux'
import { Table, Button, Modal } from 'antd';
import Labels from '../Labels';
import selector from './selector';
import {changeSelectedIDs, deleteGitRepertory, editGitRepertory, showEditGitRepertory } from '../../service/gitRepertoryService';

const { Column } = Table;
const confirm = Modal.confirm;

class RepertoryList extends React.Component {
    //监听用户选择列表记录事件
    onSelectChange = (selectedIDs) => {
        console.log('selectedIDs changed: ', selectedIDs);
        changeSelectedIDs(selectedIDs)
    }
    //处理用户删除记录
    handleDelete = async (id) => {
        try{
            let result = await new Promise((resolve, reject)=>{
                confirm({
                    title: '您确定要删除该记录吗?',
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
                await deleteGitRepertory(id)
            }
        } catch (e){
            console.error(e)
        }
    }
    //处理用户修改记录
    handleLabels = async (gitRepertory)=>{
        showEditGitRepertory(gitRepertory)
    }
    //处理用户修改记录标签
    handleEditLabels = async (gitRepertory, labels)=>{
        gitRepertory = {...gitRepertory, labels}
        await editGitRepertory(gitRepertory)
    }
    render() {
        const {loading, selectedIDs} = this.props;
        const rowSelection = {
            selectedRowKeys: selectedIDs,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedIDs.length > 0;
        return (
            <div className="repertoryList">
                <Table footer={undefined} pagination={false} rowSelection={rowSelection} loading={loading}
                       dataSource={this.props.repertoryList} scroll={{y: 'calc(100vh - 180px)'}} rowKey={'id'}
                       locale={{
                           emptyText:
                               (<div>
                                   目前没有可备份的仓库，点击
                                   <span className="noDataRedText">新建</span>或者
                                   <span className="noDataRedText">导入</span>创建要备份的git仓库
                               </div>)
                       }}
                >
                    <Column
                        title='工程名'
                        dataIndex='name'
                        key='name'
                        width='16%'
                        className='repertoryListColumns'
                    />
                    <Column
                        title='仓库地址'
                        dataIndex='repertoryURL'
                        key='repertoryURL'
                        width='40%'
                        className='repertoryListColumns'
                    />
                    <Column
                        title='标签'
                        dataIndex='labels'
                        key='labels'
                        width='24%'
                        className='repertoryListColumns'
                        render={(text, gitRepertory) =>
                            (<Labels value={gitRepertory.labels} onChange={(labels)=>{
                                this.handleEditLabels(gitRepertory, labels)
                            }}></Labels>)
                        }
                    />
                    <Column
                        title='操作'
                        dataIndex=''
                        key='x'
                        width='20%'
                        className='repertoryListColumns'
                        render={(text, repertory) =>
                            (<div className="repertoryListBtns">
                                <Button size={'small'} icon={'edit'} onClick={()=>this.handleLabels(repertory)}>编辑</Button> &nbsp;
                                <Button size={'small'} icon={'delete'} type="danger" onClick={()=>this.handleDelete(repertory.id)}>删除</Button>
                            </div>)
                        }
                    />
                </Table>
            </div>
        );
    }
}

export default connect(
    selector,
)(RepertoryList)