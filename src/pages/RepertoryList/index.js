'use babel';
import React from 'react';
import { connect } from 'react-redux'
import { Table, Button } from 'antd';
import Labels from './Labels';
import selector from './selector';
import {changeSelectedKeys} from '../../service/gitRepertoryService';

const columns = [{
    title: '工程名',
    dataIndex: 'name',
    key: 'name',
    width: '16%',
    className: 'repertoryListColumns',
}, {
    title: '仓库地址',
    dataIndex: 'repertoryURL',
    key: 'repertoryURL',
    width: '40%',
    className: 'repertoryListColumns',
}, {
    title: '标签',
    dataIndex: 'labels',
    key: 'labels',
    width: '24%',
    className: 'repertoryListColumns',
    render: (gitRepertory) => (
        <Labels value={[]}>
        </Labels>)
}, {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    width: '20%',
    className: 'repertoryListColumns',
    render: () => (
        <div className="repertoryListBtns">
            <Button size={'small'} icon={'edit'}>编辑</Button> &nbsp;
            <Button size={'small'} icon={'delete'} type="danger">删除</Button>
        </div>) },
];

class RepertoryList extends React.Component {
    onSelectChange = (selectedIDs) => {
        console.log('selectedIDs changed: ', selectedIDs);
        changeSelectedIDs(selectedIDs)
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
                <Table footer={undefined} pagination={false} rowSelection={rowSelection} columns={columns} loading={loading}
                       dataSource={this.props.repertoryList} scroll={{y: 'calc(100vh - 180px)'}} rowKey={'id'}
                       locale={{emptyText: <div>目前没有可备份的仓库，点击<span className="noDataRedText">新建</span>或者<span className="noDataRedText">导入</span>创建要备份的git仓库</div>}}/>
            </div>
        );
    }
}

export default connect(
    selector,
)(RepertoryList)