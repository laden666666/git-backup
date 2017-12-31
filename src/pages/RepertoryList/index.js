'use babel';
import React from 'react';
import { connect } from 'react-redux'
import { Table, Button } from 'antd';
import Labels from './Labels';
import selector from './selector';

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
    dataIndex: 'label',
    key: 'label',
    width: '24%',
    className: 'repertoryListColumns',
    render: () => (
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
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render() {
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div className="repertoryList">
                <Table footer={undefined} pagination={false} rowSelection={rowSelection} columns={columns}
                       dataSource={this.props.repertoryList} scroll={{y: 'calc(100vh - 180px)'}} rowKey={'id'}
                       locale={{emptyText: <div>目前没有可备份的仓库，点击<span className="noDataRedText">新建</span>或者<span className="noDataRedText">导入</span>创建要备份的git仓库</div>}}/>
            </div>
        );
    }
}

export default connect(
    selector,
)(RepertoryList)